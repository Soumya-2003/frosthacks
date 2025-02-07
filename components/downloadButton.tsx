import React from 'react';
import { Button } from '@/components/ui/button';

const DownloadButton: React.FC = () => {
  return (
    <Button
      className="btn btn-primary"
      onClick={() => window.print()}
    >
      Download Report 📥
    </Button>
  );
};

export default DownloadButton;