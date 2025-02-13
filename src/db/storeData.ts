import prisma from "./PrismaClient"
import { scrapeMovieScript, DialogueData } from "./scraper";

async function storeDialogues(movieUrl: string) {
    const scrapedData = await scrapeMovieScript(movieUrl);
    if (!scrapedData) return;

    const { movieTitle, dialogues } = scrapedData;

    // Check if movie exists
    let movieEntry = await prisma.movie.findFirst({ where: { title: movieTitle } });
    if (!movieEntry) {
        movieEntry = await prisma.movie.create({ data: { title: movieTitle, releaseYear: 2024 } });
    }

    for (const { character, text } of dialogues) {
        // Check if character exists
        let characterEntry = await prisma.character.findFirst({
            where: { name: character, movieId: movieEntry.id }
        });

        if (!characterEntry) {
            characterEntry = await prisma.character.create({
                data: { name: character, movieId: movieEntry.id }
            });
        }

        // Insert dialogue
        await prisma.dialogue.create({
            data: {
                characterId: characterEntry.id,
                text: text
            }
        });
    }

    console.log(`✅ Successfully stored dialogues for "${movieTitle}"`);
}

// Run script with a movie URL
const movieUrl = "https://imsdb.com/scripts/Star-Wars-A-New-Hope.html"; // Example script page
storeDialogues(movieUrl)
    .then(() => console.log("Done"))
    .catch((err) => console.error(err))
    .finally(() => prisma.$disconnect());
