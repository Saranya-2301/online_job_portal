const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(function(err) {
    if (err) {
        console.log("Database connection failed");
        console.log(err.message);
    } else {
        console.log("Database connected");
    }
});


app.post("/api/register", function(req, res) {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    const sql = `
        INSERT INTO users(name,email,password,role)
        VALUES(?,?,?,?)
    `;

    db.query(
        sql,
        [name, email, password, role],
        function(err, result) {

            if (err) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }

            res.json({
                message: "Registration successful"
            });
        }
    );
});


app.post("/api/login", function(req, res) {

    const email = req.body.email;
    const password = req.body.password;

    const sql = `
        SELECT user_id,name,email,role
        FROM users
        WHERE email=? AND password=?
    `;

    db.query(
        sql,
        [email, password],
        function(err, result) {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (result.length === 0) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            res.json(result[0]);
        }
    );
});


app.get("/api/jobs", function(req, res) {

    const sql = `
        SELECT *
        FROM jobs
        ORDER BY job_id DESC
    `;

    db.query(sql, function(err, result) {

        if (err) {
            return res.status(500).json({
                message: "Unable to fetch jobs"
            });
        }

        res.json(result);
    });
});


app.get("/api/recommendations/:userId", function(req, res) {

    const userId = req.params.userId;

    const sql = `
        SELECT
            j.job_id,
            j.title,
            j.company,
            j.location,
            j.description,

            COUNT(DISTINCT js.skill_id)
            AS required_skills,

            COUNT(DISTINCT cs.skill_id)
            AS matched_skills,

            ROUND(
                COUNT(DISTINCT cs.skill_id)
                * 100.0 /
                COUNT(DISTINCT js.skill_id),
                2
            )
            AS match_percentage

        FROM jobs j

        JOIN job_skills js
        ON j.job_id = js.job_id

        LEFT JOIN candidate_skills cs
        ON js.skill_id = cs.skill_id
        AND cs.user_id = ?

        GROUP BY
            j.job_id,
            j.title,
            j.company,
            j.location,
            j.description

        ORDER BY match_percentage DESC
    `;

    db.query(
        sql,
        [userId],
        function(err, result) {

            if (err) {
                return res.status(500).json({
                    message: "Recommendation failed"
                });
            }

            res.json(result);
        }
    );
});


app.get("/api/users/:userId/skills", function(req, res) {

    const userId = req.params.userId;

    const sql = `
        SELECT
            s.skill_id,
            s.skill_name

        FROM skills s

        JOIN candidate_skills cs
        ON s.skill_id = cs.skill_id

        WHERE cs.user_id=?
    `;

    db.query(
        sql,
        [userId],
        function(err, result) {

            if (err) {
                return res.status(500).json({
                    message: "Unable to fetch skills"
                });
            }

            res.json(result);
        }
    );
});


app.post("/api/apply", function(req, res) {

    const userId = req.body.user_id;
    const jobId = req.body.job_id;

    const checkSql = `
        SELECT *
        FROM applications
        WHERE user_id=? AND job_id=?
    `;

    db.query(
        checkSql,
        [userId, jobId],
        function(err, result) {

            if (result.length > 0) {
                return res.json({
                    message: "Already applied"
                });
            }

            const sql = `
                INSERT INTO applications(user_id,job_id)
                VALUES(?,?)
            `;

            db.query(
                sql,
                [userId, jobId],
                function(err, result) {

                    if (err) {
                        return res.status(500).json({
                            message: "Application failed"
                        });
                    }

                    res.json({
                        message: "Application submitted successfully"
                    });
                }
            );
        }
    );
});


app.get("/api/applications/:userId", function(req, res) {

    const userId = req.params.userId;

    const sql = `
        SELECT
            a.application_id,
            j.title,
            j.company,
            j.location,
            a.applied_at,
            a.status

        FROM applications a

        JOIN jobs j
        ON a.job_id=j.job_id

        WHERE a.user_id=?

        ORDER BY a.applied_at DESC
    `;

    db.query(
        sql,
        [userId],
        function(err, result) {

            if (err) {
                return res.status(500).json({
                    message: "Unable to fetch applications"
                });
            }

            res.json(result);
        }
    );
});


app.post("/api/jobs", function(req, res) {

    const title = req.body.title;
    const company = req.body.company;
    const location = req.body.location;
    const description = req.body.description;

    const sql = `
        INSERT INTO jobs(title,company,location,description)
        VALUES(?,?,?,?)
    `;

    db.query(
        sql,
        [title, company, location, description],
        function(err, result) {

            if (err) {
                return res.status(500).json({
                    message: "Job creation failed"
                });
            }

            res.json({
                message: "Job posted successfully",
                job_id: result.insertId
            });
        }
    );
});


app.listen(5000, function() {

    console.log(
        "Server running at http://localhost:5000"
    );

});