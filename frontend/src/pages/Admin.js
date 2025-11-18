import React, { useState } from 'react';
import { Upload, BookOpen, CheckCircle, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useGame } from '../contexts/GameContext';
import { toast } from '../hooks/use-toast';

const Admin = () => {
  const { addEbook } = useGame();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    description: '',
    cover: '',
    tags: ''
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      toast({
        title: 'Invalid file',
        description: 'Please select a PDF file',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pdfFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a PDF file to upload',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert PDF to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(pdfFile);
      });

      // Create ebook object
      const ebook = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        pages: Math.floor(Math.random() * 300) + 50, // Mock page count
        pdfData: base64 // Store base64 PDF data
      };

      // Add to library
      addEbook(ebook);

      toast({
        title: 'Success!',
        description: 'eBook uploaded successfully'
      });

      // Reset form
      setFormData({
        title: '',
        author: '',
        category: '',
        description: '',
        cover: '',
        tags: ''
      });
      setPdfFile(null);
      e.target.reset();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload eBook. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600 mt-1">Upload and manage eBooks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-gray-200 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upload New eBook</h2>
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <Upload className="mx-auto text-gray-400 mb-2" size={48} />
                  {pdfFile ? (
                    <p className="text-gray-900 font-medium">{pdfFile.name}</p>
                  ) : (
                    <>
                      <p className="text-gray-600">Click to upload PDF</p>
                      <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Input
                required
                placeholder="Enter book title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <Input
                required
                placeholder="Enter author name"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <Input
                required
                placeholder="e.g., Programming, Science, History"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                placeholder="Enter book description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            {/* Cover URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL
              </label>
              <Input
                placeholder="https://example.com/cover.jpg"
                value={formData.cover}
                onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <Input
                placeholder="programming, javascript, web development"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isUploading}>
              {isUploading ? (
                'Uploading...'
              ) : (
                <>
                  <Upload size={20} className="mr-2" />
                  Upload eBook
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Upload Guide */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-blue-600" size={24} />
              <h3 className="font-bold text-gray-900">Upload Guide</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex gap-2">
                <CheckCircle className="text-green-600 flex-shrink-0" size={16} />
                <span>Only PDF files are supported</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="text-green-600 flex-shrink-0" size={16} />
                <span>Fill in all required fields marked with *</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="text-green-600 flex-shrink-0" size={16} />
                <span>Use high-quality cover images</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="text-green-600 flex-shrink-0" size={16} />
                <span>Add relevant tags for better search</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="text-green-600 flex-shrink-0" size={16} />
                <span>Files are stored in browser localStorage</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">Storage Info</h4>
            <p className="text-sm text-gray-600">
              eBooks are stored locally in your browser using base64 encoding. Large files may impact performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
