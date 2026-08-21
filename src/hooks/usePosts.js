import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export function usePosts(userId, blockedUsers = [], currentProfile = {}) {
  const [posts, setPosts] = useState([]);
  const blockedUsersKey = blockedUsers.join(',');

  useEffect(() => {
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    return onSnapshot(postsQuery, (snapshot) => {
      setPosts(snapshot.docs.map((postDoc) => ({ id: postDoc.id, ...postDoc.data() })).filter((post) => !blockedUsersKey.split(',').filter(Boolean).includes(post.authorId)));
    }, () => setPosts([]));
  }, [blockedUsersKey]);

  const createPost = async (content, profile) => {
    await addDoc(collection(db, 'posts'), {
      content, authorId: userId, authorName: profile.name, authorHandle: profile.handle,
      authorAvatar: profile.avatarUrl || '', likedBy: [], createdAt: serverTimestamp(),
    });
  };

  const toggleLike = async (post) => {
    const likedBy = post.likedBy || [];
    const isLiked = likedBy.includes(userId);
    const nextLikedBy = isLiked ? likedBy.filter((id) => id !== userId) : [...likedBy, userId];
    await updateDoc(doc(db, 'posts', post.id), { likedBy: nextLikedBy });

    if (post.authorId && post.authorId !== userId) {
      const notificationRef = doc(db, 'notifications', `${post.id}_${userId}_like`);
      if (isLiked) {
        await deleteDoc(notificationRef);
      } else {
        await setDoc(notificationRef, {
          type: 'like',
          recipientId: post.authorId,
          actorId: userId,
          actorName: currentProfile.name || 'Alguém',
          postId: post.id,
          postPreview: post.content?.slice(0, 80) || '',
          createdAt: serverTimestamp(),
          read: false,
        });
      }
    }
  };

  const removePost = (postId) => deleteDoc(doc(db, 'posts', postId));

  return { posts, createPost, toggleLike, removePost };
}