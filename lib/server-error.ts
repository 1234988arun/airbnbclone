
import { NextResponse } from "next/server";

export const serverError = (err: unknown, status = 500) => {
    console.error(err);

    const message =
        process.env.NODE_ENV === "development" && err instanceof Error
            ? err.message
            : "Internal server error";

    return NextResponse.json({ message }, { status });
};