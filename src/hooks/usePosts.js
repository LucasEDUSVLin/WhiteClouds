import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const emptyBlockedUsers = [];

export function usePosts(userId, blockedUsers = emptyBlockedUsers) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    return onSnapshot(postsQuery, (snapshot) => {
      setPosts(snapshot.docs.map((postDoc) => ({ id: postDoc.id, ...postDoc.data() })).filter((post) => !blockedUsers.includes(post.authorId)));
    }, () => setPosts([]));
  }, [blockedUsers]);

  const createPost = async (content, profile) => {
    await addDoc(collection(db, 'posts'), {
      content, authorId: userId, authorName: profile.name, authorHandle: profile.handle,
      authorAvatar: profile.avatarUrl || '', likedBy: [], createdAt: serverTimestamp(),
    });
  };

  const toggleLike = async (post) => {
    const likedBy = post.likedBy || [];
    const nextLikedBy = likedBy.includes(userId) ? likedBy.filter((id) => id !== userId) : [...likedBy, userId];
    await updateDoc(doc(db, 'posts', post.id), { likedBy: nextLikedBy });
  };

  const removePost = (postId) => deleteDoc(doc(db, 'posts', postId));

  return { posts, createPost, toggleLike, removePost };
}