// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define({regions:"\u0627\u0644\u0645\u0646\u0627\u0637\u0642",header:{sectionTitles:{all:"ArcGIS Online",myContent:"\u0627\u0644\u0645\u062d\u062a\u0648\u0649",myFavorites:"\u0627\u0644\u0645\u0641\u0636\u0644\u0627\u062a",myGroups:"\u0627\u0644\u0645\u062c\u0645\u0648\u0639\u0627\u062a",myOrganization:"\u0627\u0644\u0645\u0624\u0633\u0633\u0629",livingAtlas:"\u0627\u0644\u0623\u0637\u0644\u0633 \u0627\u0644\u0645\u0628\u0627\u0634\u0631",subscription:"\u0645\u062d\u062a\u0648\u0649 \u0627\u0644\u0627\u0634\u062a\u0631\u0627\u0643"},
browse:"\u0627\u0633\u062a\u0639\u0631\u0627\u0636",search:"\u0628\u062d\u062b",filterFolders:"\u062a\u0635\u0641\u064a\u0629 \u0627\u0644\u0645\u062c\u0644\u062f\u0627\u062a",allFolders:"\u062c\u0645\u064a\u0639 \u0627\u0644\u0645\u062d\u062a\u0648\u064a\u0627\u062a \u0627\u0644\u062e\u0627\u0635\u0629 \u0628\u064a",filterGroups:"\u062a\u0635\u0641\u064a\u0629 \u0627\u0644\u0645\u062c\u0645\u0648\u0639\u0627\u062a",allGroups:"\u062c\u0645\u064a\u0639 \u0645\u062d\u062a\u0648\u064a\u0627\u062a \u0627\u0644\u0645\u062c\u0645\u0648\u0639\u0629 \u0627\u0644\u062e\u0627\u0635\u0629 \u0628\u064a"},
resultCount:"\u0627\u0644\u0639\u0646\u0627\u0635\u0631",searchPlaceholders:{generic:"\u0623\u062f\u062e\u0644 \u0643\u0644\u0645\u0627\u062a \u0627\u0644\u0628\u062d\u062b"},filterChips:{mapArea:"\u062f\u0627\u062e\u0644 \u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u062e\u0631\u064a\u0637\u0629",type:"\u0627\u0644\u0646\u0648\u0639",dateModified:"\u062a\u0639\u062f\u064a\u0644",dateCreated:"\u062a\u0645 \u0627\u0644\u0625\u0646\u0634\u0627\u0621",access:"\u0645\u064f\u0634\u0627\u0631\u064e\u0643",
group:"\u0645\u062c\u0645\u0648\u0639\u0629",folder:"\u0645\u062c\u0644\u062f",status:"\u0627\u0644\u062d\u0627\u0644\u0629",clearAll:"\u0645\u0633\u062d \u0627\u0644\u0643\u0644",category:"\u0641\u0626\u0629",region:"\u0627\u0644\u0645\u0646\u0637\u0642\u0629",tagged:"\u0630\u0627\u062a \u0639\u0644\u0627\u0645\u0629"},sortOptions:{sort:"\u0641\u0631\u0632",sortBy:"\u0641\u0631\u0632 \u0627\u0644\u0645\u062d\u062a\u0648\u0649 \u0628\u0648\u0627\u0633\u0637\u0629:",sortDir:"\u0627\u062a\u062c\u0627\u0647 \u0627\u0644\u0641\u0631\u0632:",
relevance:"\u0635\u0644\u0629",title:"\u0627\u0644\u0639\u0646\u0648\u0627\u0646",owner:"\u0627\u0644\u0645\u0627\u0644\u0643",created:"\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0625\u0646\u0634\u0627\u0621",modified:"\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u062a\u0639\u062f\u064a\u0644",numviews:"\u0639\u0631\u0636 \u0627\u0644\u0639\u062f\u062f",avgrating:"\u0627\u0644\u062a\u0642\u064a\u064a\u0645",ascending:{relevance:"\u0627\u0644\u0623\u0642\u0644 \u0625\u0644\u0649 \u0627\u0644\u0623\u0643\u062b\u0631 \u0623\u0647\u0645\u064a\u0629",
title:"\u0623\u0628\u062c\u062f\u064a",owner:"\u0623\u0628\u062c\u062f\u064a",created:"\u0627\u0644\u0623\u062d\u062f\u062b",modified:"\u0627\u0644\u0623\u062d\u062f\u062b",numviews:"\u0623\u0642\u0644 \u0625\u0644\u0649 \u0627\u0644\u0623\u0643\u062b\u0631",avgrating:"\u0623\u0642\u0644 \u0625\u0644\u0649 \u0627\u0644\u0623\u0639\u0644\u0649 \u0630\u0627\u062a \u0627\u0644\u0635\u0644\u0629"},descending:{relevance:"\u0627\u0644\u0623\u0643\u062b\u0631 \u0625\u0644\u0649 \u0627\u0644\u0623\u0642\u0644 \u0630\u0627\u062a \u0627\u0644\u0635\u0644\u0629",
title:"\u0627\u0644\u062a\u0631\u062a\u064a\u0628 \u0627\u0644\u0623\u0628\u062c\u062f\u064a - \u0627\u0644\u0639\u0643\u0633\u064a",owner:"\u0627\u0644\u062a\u0631\u062a\u064a\u0628 \u0627\u0644\u0623\u0628\u062c\u062f\u064a - \u0627\u0644\u0639\u0643\u0633\u064a",created:"\u0627\u0644\u0623\u062d\u062f\u062b",modified:"\u0627\u0644\u0623\u062d\u062f\u062b",numviews:"\u0627\u0644\u0623\u0643\u062b\u0631 \u0625\u0644\u0649 \u0627\u0644\u0623\u0642\u0644",avgrating:"\u0627\u0644\u0623\u0639\u0644\u0649 \u0625\u0644\u0649 \u0627\u0644\u0623\u0642\u0644 \u0630\u0627\u062a \u0627\u0644\u0635\u0644\u0629"}},
itemDetails:{addToMap:"\u0625\u0636\u0627\u0641\u0629 \u0625\u0644\u0649 \u0627\u0644\u062e\u0631\u064a\u0637\u0629",removeFromMap:"\u0625\u0632\u0627\u0644\u0629 \u0645\u0646 \u0645\u062c\u0645\u0648\u0639\u0629",by:"\u0628\u0648\u0627\u0633\u0637\u0629",lastModified:"\u062a\u0645 \u0627\u0644\u062a\u062d\u062f\u064a\u062b",noSnippet:"\u0644\u0645 \u064a\u062a\u0648\u0641\u0631 \u0645\u0644\u062e\u0635 \u0645\u0648\u062c\u0632 \u0639\u0646 \u0627\u0644\u0639\u0646\u0635\u0631.",details:"\u0627\u0644\u0648\u0635\u0641",
termsOfUse:"\u0634\u0631\u0648\u0637 \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645",attribution:"\u0627\u0639\u062a\u0645\u0627\u062f\u0627\u062a (\u0628\u064a\u0627\u0646\u0627\u062a \u062c\u062f\u0648\u0644\u064a\u0629)",noTermsOfUse:"\u0644\u0645 \u064a\u062a\u0645 \u062a\u0648\u0641\u064a\u0631 \u0623\u064a \u0642\u064a\u0648\u062f \u0623\u0648 \u062d\u062f\u0648\u062f \u062e\u0627\u0635\u0629 \u0639\u0644\u0649 \u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0645\u062d\u062a\u0648\u0649 \u0627\u0644\u0639\u0646\u0635\u0631.",
noAttribution:"\u0644\u0627 \u062a\u062a\u0648\u0641\u0631 \u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u0625\u0642\u0631\u0627\u0631",noDescription:"\u0644\u0627 \u064a\u062a\u0648\u0641\u0631 \u0648\u0635\u0641 \u062f\u0642\u064a\u0642 \u0644\u0644\u0639\u0646\u0635\u0631.",views:"\u0639\u0631\u0636 \u0627\u0644\u0639\u062f\u062f",created:"\u062a\u0645 \u0627\u0644\u0625\u0646\u0634\u0627\u0621",sharedWith:"\u062a\u0645 \u0645\u0634\u0627\u0631\u0643\u062a\u0647 \u0645\u0639",shared:{"public":"\u0643\u0644 \u0634\u062e\u0635 (\u0639\u0627\u0645)",
org:"\u0627\u0644\u0645\u0624\u0633\u0633\u0629",shared:"\u0627\u0644\u0639\u0646\u0635\u0631 \u0644\u0645 \u064a\u062a\u0645 \u0645\u0634\u0627\u0631\u0643\u062a\u0647.","private":"\u0627\u0644\u0639\u0646\u0635\u0631 \u0644\u0645 \u064a\u062a\u0645 \u0645\u0634\u0627\u0631\u0643\u062a\u0647."},viewUser:"\u0639\u0631\u0636 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u062a\u0639\u0631\u064a\u0641\u064a \u0644\u0644\u0645\u0633\u062a\u062e\u062f\u0645",viewOrg:"\u0632\u064a\u0627\u0631\u0629 \u0627\u0644\u0645\u0624\u0633\u0633\u0629",
addToFavorites:"\u0625\u0636\u0627\u0641\u0629 \u0625\u0644\u0649 \u0627\u0644\u0645\u0641\u0636\u0644\u0627\u062a",removeFromFavorites:"\u0625\u0632\u0627\u0644\u0629 \u0645\u0646 \u0627\u0644\u0645\u0641\u0636\u0644\u0627\u062a",isFavorite:"\u0627\u0644\u0639\u0646\u0627\u0635\u0631 \u0641\u064a \u0627\u0644\u0645\u0641\u0636\u0644\u0627\u062a",notFavorite:"\u0627\u0644\u0639\u0646\u0627\u0635\u0631 \u0644\u064a\u0633\u062a \u0641\u064a \u0627\u0644\u0645\u0641\u0636\u0644\u0627\u062a",managedBy:"\u0645\u064f\u062f\u0627\u0631\u0629 \u0628\u0648\u0627\u0633\u0637\u0629:"},
results:{loadingItems:"\u062c\u0627\u0631\u0650 \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0639\u0646\u0627\u0635\u0631..",requestError:"\u062d\u062f\u062b \u062e\u0637\u0623 \u0645\u0627 \u0645\u0639 \u0627\u0644\u0637\u0644\u0628.",tooManyGroups:'\u0627\u0644\u0643\u062b\u064a\u0631 \u0645\u0646 \u0627\u0644\u0645\u062c\u0645\u0648\u0639\u0627\u062a \u0644\u0640 "\u062c\u0645\u064a\u0639 \u0645\u062d\u062a\u0648\u0649 \u0645\u062c\u0645\u0648\u0639\u0627\u062a\u064a". \u062d\u062f\u062f \u0645\u062c\u0645\u0648\u0639\u0629 \u0644\u0625\u0638\u0647\u0627\u0631 \u0627\u0644\u0645\u062d\u062a\u0648\u0649 \u0627\u0644\u062e\u0627\u0635 \u0628\u0647\u0627.',
noItemsFound:"\u0644\u0645 \u064a\u062a\u0645 \u0627\u0644\u0639\u062b\u0648\u0631 \u0639\u0644\u0649 \u0639\u0646\u0627\u0635\u0631 \u062a\u0633\u062a\u0648\u0641\u064a \u0645\u0639\u064a\u0627\u0631\u0643. \u062d\u0627\u0648\u0644 \u0645\u0633\u062d \u0628\u0639\u0636 \u0639\u0648\u0627\u0645\u0644 \u0627\u0644\u062a\u0635\u0641\u064a\u0629 \u0644\u0625\u0638\u0647\u0627\u0631 \u0645\u0632\u064a\u062f \u0645\u0646 \u0627\u0644\u0639\u0646\u0627\u0635\u0631.",empty:"\u0623\u062f\u062e\u0644 \u0628\u0639\u0636 \u0627\u0644\u0639\u0646\u0627\u0635\u0631 \u0623\u0639\u0644\u0627\u0647 \u0644\u0628\u062f\u0621 \u0639\u0645\u0644\u064a\u0629 \u0627\u0644\u0628\u062d\u062b \u0627\u0644\u062e\u0627\u0635\u0629 \u0628\u0643."},
search:"\u0628\u062d\u062b",close:"\u0625\u063a\u0644\u0627\u0642",filterPane:{filter:"\u0639\u0627\u0645\u0644 \u062a\u0635\u0641\u064a\u0629",filters:"\u0639\u0648\u0627\u0645\u0644 \u062a\u0635\u0641\u064a\u0629",mapArea:"\u0641\u0642\u0637 \u0625\u0638\u0647\u0627\u0631 \u0627\u0644\u0645\u062d\u062a\u0648\u0649 \u062f\u0627\u062e\u0644 \u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u062e\u0631\u064a\u0637\u0629",orgGroups:"\u0645\u062c\u0645\u0648\u0639\u0627\u062a \u0627\u0644\u0645\u0646\u0638\u0645\u0629",
categories:"\u0627\u0644\u0641\u0626\u0627\u062a",groupCategories:"\u062a\u062c\u0645\u064a\u0639 \u0627\u0644\u0641\u0626\u0627\u062a"},viewDetails:"\u0639\u0631\u0636 \u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0639\u0646\u0635\u0631",viewFullDetails:"\u0639\u0631\u0636 \u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0643\u0627\u0645\u0644\u0629 \u0644\u0644\u0639\u0646\u0635\u0631",groupAddDisclaimer:"\u0628\u064a\u062a_Only showing items that can be added to the current group______________________________\u0644\u0627\u062d\u0642\u0629.",
learnMore:"\u0628\u064a\u062a_Learn more_____________________\u0644\u0627\u062d\u0642\u0629",back:"\u0627\u0644\u062e\u0644\u0641",compact:"\u062c\u062f\u0648\u0644",compactView:"\u0639\u0631\u0636 \u0645\u0635\u063a\u0631",list:"\u0642\u0627\u0626\u0645\u0629",listView:"\u0639\u0631\u0636 \u0627\u0644\u0642\u0627\u0626\u0645\u0629",showing:"\u0625\u0638\u0647\u0627\u0631",viewResults:"\u0639\u0631\u0636 \u0627\u0644\u0646\u062a\u0627\u0626\u062c"});