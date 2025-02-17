const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index"); // Ensure this path is correct
const { expect } = chai;

chai.use(chaiHttp);

describe("Authentication API Tests", () => {
    let userToken = "";
    let resetToken = "";

    // ✅ Test User Registration (Web)
    it("should register a new user", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .post("/api/auth/register")
            .send({
                username: "testuser",
                email: "testuser@example.com",
                phone:"123123123",
                role: "student"
            });

        expect(res).to.have.status(201);
        expect(res.body).to.have.property("message", "Registration email sent. Please complete the process.");
    });

    // ✅ Test User Registration (Mobile)
    it("should register a new mobile user", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .post("/api/auth/register-mobile")
            .send({
                name: "Test User",
                email: "testmobile@example.com",
                username: "testmobile",
                phone: "9976543210",
                password: "Test@123",
                gender: "male",
                medical_conditions: [],
                dob: "2000-01-01"
            });

        expect(res).to.have.status(201);
        expect(res.body).to.have.property("success", true);
        expect(res.body).to.have.property("token");
    });

    // ✅ Test User Login
    it("should log in an existing user", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .post("/api/auth/login")
            .send({
                email: "testmobile@example.com",
                password: "Test@123"
            });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body).to.have.property("token");
        userToken = res.body.token;
    });

    // ✅ Test Validate Session
    it("should validate user session", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .get("/api/auth/validate-session")
            .set("Authorization", `Bearer ${userToken}`);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Token is valid");
    });

    // ✅ Test Password Reset Request
    it("should request a password reset", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .post("/api/auth/reset-password-request")
            .send({ email: "testmobile@example.com" });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Password reset email sent");

        // Simulate fetching the reset token (You might need to mock email sending)
        resetToken = "mocked-reset-token"; // Replace with real token if possible
    });



    // ❌ Test Login with Wrong Credentials
    it("should fail to log in with incorrect credentials", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .post("/api/auth/login")
            .send({
                email: "testmobile@example.com",
                password: "WrongPassword"
            });

        expect(res).to.have.status(403);
        expect(res.body).to.have.property("message", "Invalid email or password");
    });

// ✅ Test Accessing Protected Route without Token
    it("should deny access to protected route without token", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .get("/api/auth/validate-session");

        expect(res).to.have.status(401);
        expect(res.text).to.equal("Access denied: No token provided");
    });





});
