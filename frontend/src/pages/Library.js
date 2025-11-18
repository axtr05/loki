import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Search, Filter, BookOpen, Clock } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Progress } from '../components/ui/progress';

const Library = () => {
  const { ebooks, updateReadingProgress } = useGame();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isReading, setIsReading] = useState(false);

  const categories = ['All', ...new Set(ebooks.map(book => book.category))];

  const filteredBooks = ebooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleReadBook = (book) => {
    setSelectedBook(book);
    setIsReading(true);
  };

  const handleUpdateProgress = (progress) => {
    if (selectedBook) {
      updateReadingProgress(selectedBook.id, progress);
      setSelectedBook({ ...selectedBook, readProgress: progress });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">eBook Library</h1>
        <p className="text-gray-600 mt-1">Explore and read your collection</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search books, authors, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => handleReadBook(book)}
          >
            <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {book.readProgress > 0 && (
                <div className="absolute top-2 right-2">
                  <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    {book.readProgress}%
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{book.author}</p>
              <Badge variant="secondary" className="mb-3">{book.category}</Badge>
              {book.readProgress > 0 && (
                <div className="space-y-1">
                  <Progress value={book.readProgress} className="h-1" />
                  <p className="text-xs text-gray-500">Last read: {book.lastRead}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">No books found matching your search</p>
        </div>
      )}

      {/* Reading Modal */}
      <Dialog open={isReading} onOpenChange={setIsReading}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedBook?.title}</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">by {selectedBook.author}</p>
                <Badge>{selectedBook.category}</Badge>
              </div>
              
              {/* PDF Viewer Placeholder */}
              <div className="bg-gray-50 rounded-lg p-8 min-h-[400px] flex flex-col items-center justify-center">
                <BookOpen className="text-gray-400 mb-4" size={64} />
                <p className="text-gray-600 mb-4">PDF Viewer (Base64 content will be displayed here)</p>
                <p className="text-sm text-gray-500 mb-6">Reading progress: {selectedBook.readProgress}%</p>
                
                {/* Progress Controls */}
                <div className="flex gap-2 flex-wrap justify-center">
                  <Button onClick={() => handleUpdateProgress(25)} variant="outline" size="sm">
                    Mark 25%
                  </Button>
                  <Button onClick={() => handleUpdateProgress(50)} variant="outline" size="sm">
                    Mark 50%
                  </Button>
                  <Button onClick={() => handleUpdateProgress(75)} variant="outline" size="sm">
                    Mark 75%
                  </Button>
                  <Button onClick={() => handleUpdateProgress(100)} variant="outline" size="sm">
                    Mark Complete
                  </Button>
                </div>
              </div>

              {/* Book Info */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">About this book</h4>
                <p className="text-gray-600 text-sm mb-3">{selectedBook.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedBook.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Library;
