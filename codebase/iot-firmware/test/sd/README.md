## sd.ino

This file provides a basic example of reading from and writing to an SD card using the Arduino SD library. It demonstrates:

- SD card initialization
- Writing a test message to `test.txt`
- Reading the contents of `test.txt` and outputting it to the Serial Monitor
- Serial output for progress and error reporting

---

## rest.ino

This file demonstrates how to recursively delete all files and folders from the SD card using the Arduino SD library. It includes:

- Initialization of the SD card module
- A `deleteAll` function that traverses directories and deletes files and subfolders
- Serial output for progress and error reporting

Use `rest.ino` to quickly clear the SD card's contents for testing or maintenance purposes.
