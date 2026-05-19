const { neon } = require("@neondatabase/serverless");

exports.handler = async (event) => {
  const sql = neon(process.env.DATABASE_URL);
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const { action, ...params } = JSON.parse(event.body || "{}");

  try {
    if (action === "load") {
      const { year } = params;
      const comp = await sql`SELECT * FROM pm_completions WHERE year = ${year}`;
      const mach = await sql`SELECT * FROM pm_machine_done WHERE year = ${year}`;
      return { statusCode: 200, headers, body: JSON.stringify({ comp, mach }) };
    }

    if (action === "task_toggle") {
      const { task_id, year, month, technician } = params;
      const existing = await sql`SELECT id FROM pm_completions WHERE task_id=${task_id} AND year=${year} AND month=${month}`;
      if (existing.length) {
        await sql`DELETE FROM pm_completions WHERE id=${existing[0].id}`;
        return { statusCode: 200, headers, body: JSON.stringify({ deleted: true }) };
      } else {
        const rows = await sql`INSERT INTO pm_completions(task_id,year,month,technician,status) VALUES(${task_id},${year},${month},${technician},'done') RETURNING *`;
        return { statusCode: 200, headers, body: JSON.stringify({ data: rows[0] }) };
      }
    }

    if (action === "machine_toggle") {
      const { machine_id, year, month, technician, task_ids } = params;
      const existing = await sql`SELECT id FROM pm_machine_done WHERE machine_id=${machine_id} AND year=${year} AND month=${month}`;
      if (existing.length) {
        await sql`DELETE FROM pm_machine_done WHERE id=${existing[0].id}`;
        return { statusCode: 200, headers, body: JSON.stringify({ deleted: true }) };
      } else {
        const rows = await sql`INSERT INTO pm_machine_done(machine_id,year,month,technician) VALUES(${machine_id},${year},${month},${technician}) RETURNING *`;
        for (const tid of (task_ids || [])) {
          await sql`INSERT INTO pm_completions(task_id,year,month,technician,status) VALUES(${tid},${year},${month},${technician},'done') ON CONFLICT(task_id,year,month) DO NOTHING`;
        }
        const comp = await sql`SELECT * FROM pm_completions WHERE year=${year} AND month=${month}`;
        return { statusCode: 200, headers, body: JSON.stringify({ data: rows[0], comp }) };
      }
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: "unknown action" }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
