import Level1Learning from "@/app/components/Level1Learning";
//import AlphabetTest from "@/components/games/AlphabetTest";
// import other game components...

export default function PlayLevel({ params }: { params: { level: string } }) {
  switch (params.level) {
    case "1learning":
      return <Level1Learning />;
    // case "1test":
    //   return <AlphabetTest />;
    // case "2learning":
    //   return <WordLearning />;
    // case "3reading":
    //   return <SentenceReading />;
    default:
      return <div className="p-10 text-red-600">Invalid level</div>;
  }
}
