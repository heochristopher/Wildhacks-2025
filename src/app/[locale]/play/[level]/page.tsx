import Level1Learning from "@/components/Level1Learning";
import Level1Test from "@/components/Level1Test";
import Level2Learning from "@/components/Level2Learning";
import Level2Test from "@/components/Level2Test";
import Level3Reading from "@/components/Level3Reading";
import Level3Writing from "@/components/Level3Writing";

export default function PlayLevel({ params }: { params: { level: string } }) {
  switch (params.level) {
    case "1learning":
      return <Level1Learning />;
    case "1test":
      return <Level1Test />;
    case "2learning":
      return <Level2Learning />;
    case "2test":
      return <Level2Test />;
    case "3reading":
      return <Level3Reading />;
    case "3writing":
      return <Level3Writing />;
    default:
      return <div className="p-10 text-red-600">Invalid level</div>;
  }
}
