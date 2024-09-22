import React, { useState, useEffect } from "react";

const Book = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [publication, setPublication] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState(true);

  // Load all books on component mount
  useEffect(() => {
    loadBooks();
  }, []);

  // Fetch all books from the backend
  async function loadBooks() {
    try {
      const response = await fetch("http://localhost:8080/api/v1/books");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error loading books:", error);
    }
  }

  // Create a new book
  async function createBook(event) {
    event.preventDefault();
    try {
      const newBook = {
        name,
        author,
        publication,
        price: parseFloat(price),
        availability,
      };
      await fetch("http://localhost:8080/api/v1/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });
      alert("Book Created Successfully");
      resetForm();
      loadBooks();
    } catch (error) {
      console.error("Error creating book:", error);
      alert("Book Creation Failed");
    }
  }

  // Update an existing book
  async function updateBook(event) {
    event.preventDefault();
    if (!selectedBook) return;
    try {
      const updatedBook = {
        name,
        author,
        publication,
        price: parseFloat(price),
        availability,
      };
      await fetch(
        `http://localhost:8080/api/v1/book?name=${selectedBook.name}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedBook),
        }
      );
      alert("Book Updated Successfully");
      resetForm();
      loadBooks();
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Book Update Failed");
    }
  }

  // Delete a book by name
  async function deleteBook(bookName) {
    try {
      await fetch(`http://localhost:8080/api/v1/book?name=${bookName}`, {
        method: "DELETE",
      });
      alert("Book Deleted Successfully");
      loadBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Book Deletion Failed");
    }
  }

  // Edit selected book
  async function editBook(book) {
    setSelectedBook(book);
    setName(book.name);
    setAuthor(book.author);
    setPublication(book.publication);
    setPrice(book.price);
    setAvailability(book.availability); // Ensure availability is handled properly
  }

  // Reset form after operation
  function resetForm() {
    setSelectedBook(null);
    setName("");
    setAuthor("");
    setPublication("");
    setPrice("");
    setAvailability(true);
  }

  return (
    <div>
      <h1>Book Inventory</h1>
      <form onSubmit={selectedBook ? updateBook : createBook}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Publication</label>
          <input
            type="text"
            value={publication}
            onChange={(e) => setPublication(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Availability</label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value === "true")}
          >
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
        <button type="submit">
          {selectedBook ? "Update Book" : "Create Book"}
        </button>
      </form>

      <h2>Books List</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <div>
              <strong>Name:</strong> {book.name}
              <br />
              <strong>Author:</strong> {book.author}
              <br />
              <strong>Publication:</strong> {book.publication}
              <br />
              <strong>Price:</strong> ₹{book.price}
              <br />
              <strong>Availability:</strong>{" "}
              {book.availability ? "Available" : "Unavailable"}
              <br />
              <button onClick={() => editBook(book)}>Edit</button>
              <button onClick={() => deleteBook(book.name)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Book;
