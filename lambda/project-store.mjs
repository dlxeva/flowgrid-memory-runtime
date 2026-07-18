export async function findProject(db, slug) {
  const result = await db.query(
    "SELECT id, slug FROM projects WHERE slug = $1",
    [slug],
  );
  return result.rows[0] ?? null;
}

export async function ensureProject(db, slug) {
  const inserted = await db.query(
    `INSERT INTO projects (slug) VALUES ($1)
     ON CONFLICT (slug) DO NOTHING
     RETURNING id, slug`,
    [slug],
  );

  return inserted.rows[0] ?? findProject(db, slug);
}
