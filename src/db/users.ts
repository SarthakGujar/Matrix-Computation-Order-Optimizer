import { db } from './index.ts';
import { users, optimizationRuns } from './schema.ts';
import { eq, desc, and } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name?: string, avatar?: string) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        name: name || '',
        avatar: avatar || '',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(name ? { name } : {}),
          ...(avatar ? { avatar } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in getOrCreateUser:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function saveOptimizationRun(data: {
  userId?: number;
  userUid?: string;
  name?: string;
  matrixCount: number;
  dimensions: number[];
  minimumCost: string;
  parenthesization: string;
  costTable: (number | null)[][];
  splitTable: (number | null)[][];
}) {
  try {
    const result = await db.insert(optimizationRuns)
      .values({
        userId: data.userId || null,
        userUid: data.userUid || null,
        name: data.name || `Chain of ${data.matrixCount} Matrices`,
        matrixCount: data.matrixCount,
        dimensions: JSON.stringify(data.dimensions),
        minimumCost: data.minimumCost,
        parenthesization: data.parenthesization,
        costTable: JSON.stringify(data.costTable),
        splitTable: JSON.stringify(data.splitTable),
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in saveOptimizationRun:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getOptimizationRuns(userUid?: string) {
  try {
    if (userUid) {
      return await db.select()
        .from(optimizationRuns)
        .where(eq(optimizationRuns.userUid, userUid))
        .orderBy(desc(optimizationRuns.createdAt));
    }
    // Return recent runs if no user
    return await db.select()
      .from(optimizationRuns)
      .orderBy(desc(optimizationRuns.createdAt))
      .limit(20);
  } catch (error) {
    console.error('Database query failed in getOptimizationRuns:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getOptimizationRunById(id: number, userUid?: string) {
  try {
    const conditions = [eq(optimizationRuns.id, id)];
    if (userUid) {
      conditions.push(eq(optimizationRuns.userUid, userUid));
    }
    const result = await db.select()
      .from(optimizationRuns)
      .where(and(...conditions))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Database query failed in getOptimizationRunById:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function deleteOptimizationRun(id: number, userUid?: string) {
  try {
    const conditions = [eq(optimizationRuns.id, id)];
    if (userUid) {
      conditions.push(eq(optimizationRuns.userUid, userUid));
    }
    const result = await db.delete(optimizationRuns)
      .where(and(...conditions))
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error('Database query failed in deleteOptimizationRun:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
