import { pool } from "../database/db";

export const autoMark = async (vehicle_id: string) => {
  await pool.query(
    `
        UPDATE vehicles SET availability_status=$1 WHERE id=$2
        `,
    ["available", vehicle_id]
  );
};
