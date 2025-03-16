# Netwalking

A Next.js application for managing and displaying walking events. Built with Next.js 14, TypeScript, Tailwind CSS, and Cloudinary for image management.

## Features

- Event listing with cover images
- Detailed event pages with image galleries
- Image upload and management using Cloudinary
- Drag-and-drop image reordering
- Responsive design
- TypeScript for type safety
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- A Cloudinary account

### Installation

1. Clone the repository:

```bash
git clone [your-repository-url]
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Create a `.env` file in the root directory and add your Cloudinary credentials:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and shared code
- `/public` - Static assets

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is licensed under the MIT License.
