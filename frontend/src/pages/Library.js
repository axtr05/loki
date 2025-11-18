import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { Search, Filter, BookOpen, Clock } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Progress } from '../components/ui/progress';

const Library = () => {
  const { ebooks, updateReadingProgress, user, purchaseBook } = useGame();
  const navigate = useNavigate();
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
    if (!book.isPurchased) return;
    setSelectedBook(book);
    setIsReading(true);
  };

  const handlePurchaseBook = (book) => {
    if (!user) return;
    
    if (user.credits < book.price) {
      alert(`Not enough credits! You need ${book.price} credits but only have ${user.credits} credits.`);
      return;
    }

    const success = purchaseBook(book.id, book.price);
    if (success) {
      alert(`Successfully unlocked "${book.title}"! You can now read it.`);
    }
  };

  const handleUpdateProgress = (progress) => {
    if (selectedBook) {
      updateReadingProgress(selectedBook.id, progress);
      setSelectedBook({ ...selectedBook, readProgress: progress });
      
      // Show completion message
      if (progress === 100) {
        const book = ebooks.find(b => b.id === selectedBook.id);
        setIsReading(false);
        
        // Check if book has a quiz requirement
        if (book.hasQuiz && book.quizId) {
          setTimeout(() => {
            alert(`Congratulations! You completed "${book.title}"!\n\nNow take the quiz to earn your credits!`);
            // Store quiz requirement in localStorage
            localStorage.setItem('pendingQuiz', JSON.stringify({
              bookId: book.id,
              bookTitle: book.title,
              quizId: book.quizId
            }));
            navigate('/study-tools', { state: { openQuiz: book.quizId } });
          }, 500);
        } else {
          setTimeout(() => {
            alert(`Congratulations! You completed "${book.title}" and earned ${book.creditsReward} credits!`);
          }, 500);
        }
      }
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
            className={`bg-white rounded-xl border-2 overflow-hidden hover:shadow-lg transition-all ${
              book.isPurchased ? 'border-gray-200 cursor-pointer' : 'border-orange-200'
            } group`}
            onClick={() => book.isPurchased && handleReadBook(book)}
          >
            <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
              <img
                src={book.cover}
                alt={book.title}
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  book.isPurchased ? 'group-hover:scale-105' : 'opacity-60'
                }`}
              />
              
              {/* Locked overlay */}
              {!book.isPurchased && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-white font-bold text-lg">{book.price} Credits</p>
                  </div>
                </div>
              )}
              
              {/* Free badge */}
              {book.price === 0 && (
                <div className="absolute top-2 left-2">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    FREE
                  </div>
                </div>
              )}
              
              {/* Progress badge */}
              {book.isPurchased && book.readProgress > 0 && (
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
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary">{book.category}</Badge>
                {!book.isPurchased && (
                  <span className="text-xs text-orange-600 font-semibold">
                    Earn {book.creditsReward} credits
                  </span>
                )}
              </div>
              
              {book.isPurchased && book.readProgress > 0 && (
                <div className="space-y-1">
                  <Progress value={book.readProgress} className="h-1" />
                  <p className="text-xs text-gray-500">Last read: {book.lastRead}</p>
                </div>
              )}
              
              {!book.isPurchased && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePurchaseBook(book);
                  }}
                  className="w-full mt-2"
                  variant="default"
                >
                  Unlock for {book.price} Credits
                </Button>
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
