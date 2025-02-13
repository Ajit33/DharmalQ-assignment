import axios from "axios";
import * as cheerio from "cheerio";

export interface DialogueData {
    character: string;
    movie: string;
    text: string;
}

export async function scrapeMovieScript(movieUrl: string): Promise<{ movieTitle: string; dialogues: DialogueData[] } | null> {
    try {
        const { data } = await axios.get(movieUrl);
        const $ = cheerio.load(data);

        let movieTitle = $("h1").text().trim();
        let dialogues: DialogueData[] = [];

        $("pre").each((_, element) => {
            const lines = $(element).text().split("\n");

            let currentCharacter = "";
            for (const line of lines) {
                if (line.trim() === "") continue;

                if (line === line.toUpperCase() && line.length < 20) {
                    currentCharacter = line.trim();
                } else if (currentCharacter) {
                    dialogues.push({ character: currentCharacter, movie: movieTitle, text: line.trim() });
                }
            }
        });

        return { movieTitle, dialogues };
    } catch (error) {
        console.error("Error scraping script:", error);
        return null;
    }
}
