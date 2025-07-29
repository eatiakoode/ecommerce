import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FilterBar({ filter, setFilter }) {
  const handleFilter = (e) => {
    e.preventDefault();
    // Filtering is handled reactively
  };
  const handleReset = () => setFilter("");

  return (
    <Card className="mb-5 p-4 flex flex-col md:flex-row gap-4 items-center">
      <Input
        type="search"
        placeholder="Search by size..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="h-12 md:basis-1/2"
      />
      <Button className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition" onClick={handleFilter}>
        Filter
      </Button>
      <Button className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition" onClick={handleReset} variant="secondary">
        Reset
      </Button>
    </Card>
  );
} 