export default function Filter({ onFilter }: { onFilter: (type: string) => void }) {
    const types = ['Fire', 'Water', 'Grass', 'Electric', 'Normal'];
  
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-white shadow-lg rounded-full px-4 py-2 flex gap-2">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => onFilter(type)}
              className="bg-indigo-100 px-2 py-1 rounded hover:bg-indigo-200 text-sm"
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    );
  }