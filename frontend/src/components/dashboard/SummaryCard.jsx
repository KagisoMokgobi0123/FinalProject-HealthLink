const SummaryCard = ({ icon, text, number }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4 hover:shadow-lg transition">
      {/* Icon */}
      <div className="text-teal-600 text-3xl">{icon}</div>

      {/* Text and Number */}
      <div>
        <p className="text-gray-500 text-sm">{text}</p>
        <p className="text-gray-800 text-xl font-semibold">{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
