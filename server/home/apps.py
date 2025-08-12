from django.apps import AppConfig


class HomeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'home'
    
    def ready(self):
        """Force Cloudinary storage when app is ready"""
        try:
            from django.core.files.storage import default_storage
            from cloudinary_storage.storage import MediaCloudinaryStorage
            
            # Force the default storage to use Cloudinary
            import django.core.files.storage
            django.core.files.storage.default_storage = MediaCloudinaryStorage()
            
            print("✅ Cloudinary storage forced in home app")
        except Exception as e:
            print(f"❌ Error forcing Cloudinary storage: {e}")
