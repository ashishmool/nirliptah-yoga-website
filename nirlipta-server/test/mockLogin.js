const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index"); // Ensure this path is correct
const { expect } = chai;

chai.use(chaiHttp);

let adminToken = ""; // Store the token globally

// Function to log in as an admin before running tests
const loginAsAdmin = async () => {
    if (adminToken) return adminToken; // Return existing token if already obtained

    const loginRes = await chai.request(app)
        .post("/api/auth/login") // Replace with actual login endpoint
        .send({
            email: "nirliptayoga@gmail.com", // Admin credentials
            password: "admin@123"
        });

    expect(loginRes).to.have.status(200);
    expect(loginRes.body).to.have.property("token");

    adminToken = loginRes.body.token; // Store the token
    return adminToken;
};

module.exports = { loginAsAdmin };
