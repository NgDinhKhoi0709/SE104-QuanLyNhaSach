const bookController = require('../../controllers/bookController');
const bookService = require('../../services/bookService');

// Mock bookService
jest.mock('../../services/bookService');

describe('BookController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getAllBooks', () => {
    it('should return all books successfully', async () => {
      const mockBooks = [
        { id: 1, title: 'Book 1', author: 'Author 1' },
        { id: 2, title: 'Book 2', author: 'Author 2' }
      ];
      
      bookService.getAllBooks.mockResolvedValue(mockBooks);

      await bookController.getAllBooks(req, res);

      expect(bookService.getAllBooks).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(mockBooks);
    });

    it('should handle errors when fetching books fails', async () => {
      const errorMessage = 'Database connection error';
      bookService.getAllBooks.mockRejectedValue(new Error(errorMessage));

      await bookController.getAllBooks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch books' });
    });
  });

  describe('createBook', () => {
    it('should create a book successfully', async () => {
      const bookData = {
        title: 'New Book',
        author: 'New Author',
        price: 100000,
        stock: 50
      };
      const createdBook = { id: 1, ...bookData };

      req.body = bookData;
      bookService.createBook.mockResolvedValue(createdBook);

      await bookController.createBook(req, res);

      expect(bookService.createBook).toHaveBeenCalledWith(bookData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdBook);
    });

    it('should handle errors when creating book fails', async () => {
      const bookData = { title: 'Invalid Book' };
      req.body = bookData;
      
      const errorMessage = 'Validation error';
      bookService.createBook.mockRejectedValue(new Error(errorMessage));

      await bookController.createBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add book' });
    });
  });

  describe('updateBook', () => {
    it('should update a book successfully', async () => {
      const bookId = '1';
      const updateData = { title: 'Updated Book', price: 150000 };
      const updatedBook = { id: 1, title: 'Updated Book', price: 150000 };

      req.params = { id: bookId };
      req.body = updateData;
      bookService.updateBook.mockResolvedValue(updatedBook);

      await bookController.updateBook(req, res);

      expect(bookService.updateBook).toHaveBeenCalledWith(bookId, updateData);
      expect(res.json).toHaveBeenCalledWith(updatedBook);
    });

    it('should handle errors when updating book fails', async () => {
      const bookId = '999';
      const updateData = { title: 'Updated Book' };

      req.params = { id: bookId };
      req.body = updateData;
      
      const errorMessage = 'Book not found';
      bookService.updateBook.mockRejectedValue(new Error(errorMessage));

      await bookController.updateBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
