async function register() {

    const name =
        document.getElementById("name").value;

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const role =
        document.getElementById("role").value;


    const response = await fetch("/api/register", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            role: role
        })

    });


    const data = await response.json();

    document.getElementById("message").innerText =
        data.message;

}


async function login() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;


    const response = await fetch("/api/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email: email,
            password: password
        })

    });


    const data = await response.json();


    if (response.ok) {

        localStorage.setItem(
            "user",
            JSON.stringify(data)
        );

        window.location.href = "jobs.html";

    } else {

        document.getElementById("message").innerText =
            data.message;

    }

}


async function loadJobs() {

    const user =
        JSON.parse(localStorage.getItem("user"));


    if (!user) {

        window.location.href = "login.html";

        return;

    }


    const response =
        await fetch(
            `/api/recommendations/${user.user_id}`
        );


    const jobs =
        await response.json();


    const container =
        document.getElementById("jobs");


    if (!container) {

        return;

    }


    container.innerHTML = "";


    jobs.forEach(function(job) {

        const div =
            document.createElement("div");


        div.className = "job-card";


        div.innerHTML = `

            <h2>
                ${job.title}
            </h2>

            <h3>
                ${job.company}
            </h3>

            <p>
                Location:
                ${job.location}
            </p>

            <p>
                ${job.description}
            </p>

            <p>
                Required Skills:
                ${job.required_skills}
            </p>

            <p>
                Your Matching Skills:
                ${job.matched_skills}
            </p>

            <div class="match">

                Match:
                ${job.match_percentage}%

            </div>

            <button
                onclick="applyJob(${job.job_id})"
            >
                Apply
            </button>

        `;


        container.appendChild(div);

    });

}


async function applyJob(jobId) {

    const user =
        JSON.parse(localStorage.getItem("user"));


    const response =
        await fetch("/api/apply", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                user_id: user.user_id,

                job_id: jobId

            })

        });


    const data =
        await response.json();


    alert(data.message);

}


async function loadProfile() {

    const user =
        JSON.parse(localStorage.getItem("user"));


    if (!user) {

        window.location.href = "login.html";

        return;

    }


    const name =
        document.getElementById("profileName");

    const email =
        document.getElementById("profileEmail");


    if (name) {

        name.innerText =
            user.name;

    }


    if (email) {

        email.innerText =
            user.email;

    }


    const response =
        await fetch(
            `/api/users/${user.user_id}/skills`
        );


    const skills =
        await response.json();


    const container =
        document.getElementById("skills");


    if (container) {

        skills.forEach(function(skill) {

            const span =
                document.createElement("span");

            span.className = "skill";

            span.innerText =
                skill.skill_name;

            container.appendChild(span);

        });

    }


    loadApplications(user.user_id);

}


async function loadApplications(userId) {

    const response =
        await fetch(
            `/api/applications/${userId}`
        );


    const applications =
        await response.json();


    const container =
        document.getElementById("applications");


    if (!container) {

        return;

    }


    applications.forEach(function(application) {

        const div =
            document.createElement("div");

        div.className =
            "application-card";


        div.innerHTML = `

            <h3>
                ${application.title}
            </h3>

            <p>
                ${application.company}
            </p>

            <p>
                ${application.location}
            </p>

            <p>
                Status:
                ${application.status}
            </p>

        `;


        container.appendChild(div);

    });

}


async function postJob() {

    const title =
        document.getElementById("jobTitle").value;

    const company =
        document.getElementById("company").value;

    const location =
        document.getElementById("location").value;

    const description =
        document.getElementById("description").value;


    const response =
        await fetch("/api/jobs", {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                title: title,

                company: company,

                location: location,

                description: description

            })

        });


    const data =
        await response.json();


    document.getElementById("message")
        .innerText =
        data.message;

}


loadJobs();

loadProfile();