import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const urlApi = "https://v2.jokeapi.dev/joke";

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
// GET Route for Home Page
app.get("/", (req, res) => {
    res.render("index", { content: "" }); // Ensure content has a default value
});

// POST Route to Fetch Jokes
app.post("/submit", async (req, res) => {
    try {
        let flags = [];
        const category = req.body.category || "Any";
        const jokeType = req.body.joke || "single";
        const amount = req.body.amount || 1;
        const language = req.body.languages || "en";
        const format = req.body.format || "txt"

        // Collect selected flags
        if (req.body.nsfw) flags.push("nsfw");
        if (req.body.religious) flags.push("religious");
        if (req.body.political) flags.push("political");
        if (req.body.sexist) flags.push("sexist");

        const allFlags = flags.join(',');

        // Construct API URL
        const apiUrl = `${urlApi}/${category}?lang=${language}&blacklistFlags=${allFlags}&type=${jokeType}&amount=${amount}&format=${format}`;
        console.log("API URL:", apiUrl); // Debugging

        // Fetch jokes from the API
        const result = await axios.get(apiUrl);
        const data = result.data;

        // Render the response in the template
        res.render("index", { content: JSON.stringify(data, null, 2) });
    } catch (error) {
        console.error("Error fetching data:", error.message);

        // Render error message
        res.render("index", { content: "Error fetching jokes. Please try again." });
    }
});

// Start the Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
