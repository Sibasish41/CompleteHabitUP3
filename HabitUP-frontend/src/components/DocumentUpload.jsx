import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DocumentUpload = ({ 
  onUpload, 
  acceptedTypes = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  maxSize = 10, // MB
  multiple = false,
  label = 'Upload Document',
  description = 'Drag and drop files here or click to browse'
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files) => {
    const fileArray = Array.from(files)
    const validFiles = []

    // Validate files
    for (const file of fileArray) {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`)
        continue
      }

      const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
      if (!acceptedTypes.includes(fileExtension)) {
        alert(`File type ${fileExtension} is not supported.`)
        continue
      }

      validFiles.push(file)
    }

    if (validFiles.length === 0) return

    setUploading(true)

    // Simulate upload process
    for (const file of validFiles) {
      const fileId = Date.now() + Math.random()
      
      // Add file to uploaded files list
      const fileData = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        status: 'uploading'
      }

      setUploadedFiles(prev => [...prev, fileData])

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }))
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Mark as completed
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileId ? { ...f, status: 'completed' } : f)
      )

      // Call onUpload callback if provided
      if (onUpload) {
        onUpload(file)
      }
    }

    setUploading(false)
    setUploadProgress({})
  }

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase()
    switch (extension) {
      case 'pdf':
        return 'fas fa-file-pdf text-red-500'
      case 'doc':
      case 'docx':
        return 'fas fa-file-word text-blue-500'
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'fas fa-file-image text-green-500'
      default:
        return 'fas fa-file text-gray-500'
    }
  }

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-purple-400 bg-purple-50' 
            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <i className="fas fa-cloud-upload-alt text-purple-600 text-2xl"></i>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{label}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Choose Files
            </button>
          </div>

          <div className="text-sm text-gray-500">
            <p>Supported formats: {acceptedTypes.replace(/\./g, '').toUpperCase()}</p>
            <p>Maximum file size: {maxSize}MB</p>
          </div>
        </motion.div>
      </div>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Uploaded Files ({uploadedFiles.length})
            </h4>
            
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    <i className={getFileIcon(file.name)}></i>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {file.uploadedAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {file.status === 'uploading' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[file.id] || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {uploadProgress[file.id] || 0}%
                        </span>
                      </div>
                    )}

                    {file.status === 'completed' && (
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-check-circle text-green-500"></i>
                        <span className="text-xs text-green-600">Uploaded</span>
                      </div>
                    )}

                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Remove file"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Status */}
      {uploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <i className="fas fa-spinner animate-spin text-blue-600"></i>
            <span className="text-sm text-blue-800">Uploading files...</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default DocumentUpload