"""
Script to download the trained model from your Kaggle notebook output
and place it in the correct location for app.py.

INSTRUCTIONS:
1. Go to your Kaggle notebook: tumor-detector.ipynb
2. Click on "Output" tab (or "Data" > "Output Files")
3. Download "best_model.keras"
4. Place the downloaded file in this folder (same folder as this script)
5. Run this script: python download_model_from_kaggle.py

OR, if you have the Kaggle API set up:
   pip install kaggle
   Then this script will auto-download it for you.
"""

import os
import shutil
import sys


TARGET_PATH = os.path.join("model", "best_model .keras.keras")


def check_already_have_model():
    """Check if the real model is already in place."""
    if os.path.exists(TARGET_PATH):
        size_mb = os.path.getsize(TARGET_PATH) / (1024 * 1024)
        if size_mb > 1:  # Real model is ~43 MB, dummy is tiny
            print(f"✅ Real model already found at: {TARGET_PATH} ({size_mb:.1f} MB)")
            return True
        else:
            print(f"⚠️  Found a small file at {TARGET_PATH} ({size_mb:.1f} MB) — likely the dummy model.")
    return False


def try_copy_from_local(source_name):
    """Try to copy the model from a local file."""
    candidates = [
        source_name,                           # current dir
        os.path.join(os.path.expanduser("~"), "Downloads", source_name),  # Downloads folder
        os.path.join(os.path.expanduser("~"), "Desktop", source_name),    # Desktop
    ]

    for path in candidates:
        if os.path.exists(path):
            size_mb = os.path.getsize(path) / (1024 * 1024)
            print(f"✅ Found model at: {path} ({size_mb:.1f} MB)")
            os.makedirs("model", exist_ok=True)
            shutil.copy2(path, TARGET_PATH)
            print(f"✅ Copied to: {TARGET_PATH}")
            return True

    return False


def main():
    print("=" * 60)
    print("  NeuroMap - Trained Model Setup")
    print("=" * 60)
    print()

    # Check if already done
    if check_already_have_model():
        print("\n✅ You're all set! Run: python app.py")
        return

    print("\nLooking for 'best_model.keras' locally...")

    # Try to find the downloaded Kaggle model
    if try_copy_from_local("best_model.keras"):
        size_mb = os.path.getsize(TARGET_PATH) / (1024 * 1024)
        print(f"\n✅ Model installed! ({size_mb:.1f} MB)")
        print("✅ Run: python app.py")
        return

    # Not found — guide the user
    print("\n❌ Could not find 'best_model.keras' locally.")
    print()
    print("=" * 60)
    print("  HOW TO GET YOUR TRAINED MODEL FROM KAGGLE:")
    print("=" * 60)
    print()
    print("Option 1 - Manual Download:")
    print("  1. Open your Kaggle notebook")
    print("  2. Click the 'Output' tab in the right panel")
    print("  3. Find 'best_model.keras' and click Download")
    print("  4. Move the downloaded file to this folder:")
    print(f"     {os.path.abspath('.')}")
    print("  5. Run this script again: python download_model_from_kaggle.py")
    print()
    print("Option 2 - Kaggle API (if configured):")
    print("  pip install kaggle")
    print("  kaggle kernels output <your-username>/<notebook-slug> -p .")
    print("  Then run this script again.")
    print()
    print("=" * 60)

    # Ask if user wants to use the Kaggle API now
    try:
        import kaggle
        print("\nKaggle API is installed! Enter your notebook details:")
        username = input("Your Kaggle username: ").strip()
        notebook_slug = input("Your notebook slug (e.g. 'tumor-detector'): ").strip()

        kernel_name = f"{username}/{notebook_slug}"
        print(f"\nDownloading output from: {kernel_name}")

        import subprocess
        result = subprocess.run(
            ["kaggle", "kernels", "output", kernel_name, "-p", "."],
            capture_output=True, text=True
        )

        if result.returncode == 0:
            print(result.stdout)
            if try_copy_from_local("best_model.keras"):
                size_mb = os.path.getsize(TARGET_PATH) / (1024 * 1024)
                print(f"\n✅ Model installed! ({size_mb:.1f} MB)")
                print("✅ Run: python app.py")
            else:
                print("⚠️  Download seemed to work but 'best_model.keras' not found.")
                print("    Check what files were downloaded in this folder.")
        else:
            print(f"❌ Kaggle API error: {result.stderr}")

    except ImportError:
        print("\n(Kaggle API not installed — use manual download above)")
    except KeyboardInterrupt:
        print("\nCancelled.")


if __name__ == "__main__":
    main()
