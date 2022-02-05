The extension does not work yet, it is in dev mode

firefox onRemoved has no title, so we can not do the restoration simple

See https://bugzilla.mozilla.org/show_bug.cgi?id=1315009

# Algorithm

1. Intercept bookmark deletion
2. Start transaction
   1. If browser was closed during transaction then on browser start delete restored bookmark folder and start from the beginning
3. Restore bookmark recursive
   1. Restore bookmark folders step by step recursive
   2. Replace bookmarks' parent ids by new ones
   3. Restore bookmarks, all at once asynchronously
   4. If some bookmark was deleted during restore event then check all bookmarks by id and show a page with suggestion to restore all of them
4. Stop transaction
   1. Delete transaction from transaction log
5. On browser start check if bookmarks were modified, check it by id
   1. If a bookmark was modified show a page with suggestion to restore all of them (means from root bookmarks)