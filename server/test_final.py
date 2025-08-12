#!/usr/bin/env python
import os
import django
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

print("=== Final Cloudinary Test ===")
print(f"Settings DEFAULT_FILE_STORAGE: {settings.DEFAULT_FILE_STORAGE}")
print(f"Current default_storage: {default_storage}")
print(f"Storage class: {type(default_storage)}")

# Test if we can create a file with Cloudinary storage
try:
    # Create a test file
    test_content = ContentFile(b"test content", name="test.txt")
    
    # Try to save it using the default storage
    saved_path = default_storage.save('test/test.txt', test_content)
    print(f"\n✅ File saved successfully to: {saved_path}")
    
    # Check if it's a Cloudinary URL
    if 'cloudinary.com' in str(saved_path):
        print("✅ File is being saved to Cloudinary!")
        print(f"Cloudinary URL: {saved_path}")
    else:
        print(f"❌ File is being saved locally: {saved_path}")
    
    # Clean up
    default_storage.delete(saved_path)
    print("✅ Test file cleaned up")
    
except Exception as e:
    print(f"\n❌ Error testing storage: {e}")
    import traceback
    traceback.print_exc()
