import useCategories from "../hooks/useCategories"

function Search({ searchQuery, setSearchQuery, category, setCategory }) {
  const { categories } = useCategories()

  return (
    <div className="searchControls">
      <input
        type="search"
        aria-label="Search notes"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <select
        aria-label="Filter notes by category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="all">All</option>
        {categories.map((item) => (
          <option key={item.id} value={item.title}>
            {item.title}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Search