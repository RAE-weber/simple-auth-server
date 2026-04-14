import { describe, it, expect } from "bun:test";
import app from "../src/index";

describe("Auth API", () => {
	it("GET / returns greeting", async () => {
		const request = new Request("http://localhost/", { method: "GET" });
		const response = await app.fetch(request);
		const text = await response.text();

		expect(response.status).toBe(200);
		expect(text).toBe("Hello Hono!");
	});

	it("POST /login with valid credentials succeeds", async () => {
		const request = new Request("http://localhost/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: "test@example.com",
				password: "password123",
			}),
		});

		const response = await app.fetch(request);
		const data = (await response.json()) as {
			message: string;
			email: string;
		};

		expect(response.status).toBe(200);
		expect(data.message).toBe("Login Successful");
		expect(data.email).toBe("test@example.com");
	});

	it("POST /login with invalid email fails", async () => {
		const request = new Request("http://localhost/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: "invalid-email",
				password: "password123",
			}),
		});

		const response = await app.fetch(request);
		expect(response.status).toBe(400);
	});

	it("POST /login with short password fails", async () => {
		const request = new Request("http://localhost/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: "test@example.com",
				password: "short",
			}),
		});

		const response = await app.fetch(request);
		expect(response.status).toBe(400);
	});
});
