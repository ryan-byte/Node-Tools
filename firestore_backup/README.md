### firebase storage backup:
- create `firebaseConfig.env` from `firebaseConfig.env.example`
- currently this backup/restore only works on single folder in firebase storage, make sure to change this variable `firestorage_filesFolder` from both `backup.js` and `restore.js` to the name of ur firebase storage folder.