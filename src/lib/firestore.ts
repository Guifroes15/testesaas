import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, query, where, getDocs, addDoc,
  serverTimestamp, Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Workspace, WorkspaceMember, UserProfile, Store, Idea } from '@/types'

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUser(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? (snap.data() as UserProfile) : null
}

export async function createUser(profile: UserProfile): Promise<void> {
  await setDoc(doc(db, 'users', profile.uid), profile)
}

export async function updateUser(uid: string, data: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), data)
}

// ─── Workspaces ───────────────────────────────────────────────────────────────

export async function getWorkspace(id: string): Promise<Workspace | null> {
  const snap = await getDoc(doc(db, 'workspaces', id))
  return snap.exists() ? (snap.data() as Workspace) : null
}

export async function createWorkspace(workspace: Omit<Workspace, 'id'>): Promise<string> {
  const ref = doc(collection(db, 'workspaces'))
  await setDoc(ref, { ...workspace, id: ref.id })
  return ref.id
}

export async function updateWorkspace(id: string, data: Partial<Workspace>): Promise<void> {
  await updateDoc(doc(db, 'workspaces', id), { ...data, updatedAt: new Date().toISOString() })
}

export async function listWorkspaces(): Promise<Workspace[]> {
  const snap = await getDocs(collection(db, 'workspaces'))
  return snap.docs.map(d => d.data() as Workspace)
}

// ─── Members ──────────────────────────────────────────────────────────────────

export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  const snap = await getDocs(collection(db, 'workspaces', workspaceId, 'members'))
  return snap.docs.map(d => d.data() as WorkspaceMember)
}

export async function addWorkspaceMember(workspaceId: string, member: WorkspaceMember): Promise<void> {
  await setDoc(doc(db, 'workspaces', workspaceId, 'members', member.uid), member)
}

export async function removeWorkspaceMember(workspaceId: string, uid: string): Promise<void> {
  await deleteDoc(doc(db, 'workspaces', workspaceId, 'members', uid))
}

// ─── Stores ───────────────────────────────────────────────────────────────────

export async function getWorkspaceStores(workspaceId: string): Promise<Store[]> {
  const q = query(collection(db, 'stores'), where('workspaceId', '==', workspaceId))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data() as Store)
}

export async function createStore(store: Omit<Store, 'id'>): Promise<string> {
  const ref = doc(collection(db, 'stores'))
  await setDoc(ref, { ...store, id: ref.id })
  return ref.id
}

export async function updateStore(id: string, data: Partial<Store>): Promise<void> {
  await updateDoc(doc(db, 'stores', id), data)
}

export async function deleteStore(id: string): Promise<void> {
  await deleteDoc(doc(db, 'stores', id))
}

// ─── Ideas ────────────────────────────────────────────────────────────────────

export async function getWorkspaceIdeas(workspaceId: string): Promise<Idea[]> {
  const q = query(collection(db, 'ideas'), where('workspaceId', '==', workspaceId))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data() as Idea)
}

export async function createIdea(idea: Omit<Idea, 'id'>): Promise<string> {
  const ref = doc(collection(db, 'ideas'))
  await setDoc(ref, { ...idea, id: ref.id })
  return ref.id
}

export async function updateIdea(id: string, data: Partial<Idea>): Promise<void> {
  await updateDoc(doc(db, 'ideas', id), data)
}

export async function deleteIdea(id: string): Promise<void> {
  await deleteDoc(doc(db, 'ideas', id))
}
