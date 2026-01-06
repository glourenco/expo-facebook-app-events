function uniq(arr) {
  return Array.from(new Set(arr));
}

function boolToAndroidString(value) {
  return value ? "true" : "false";
}

function ensureArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function addOrReplaceManifestMetaData(application, name, value) {
  application["meta-data"] = ensureArray(application["meta-data"]);

  const items = application["meta-data"];
  const existingIndex = items.findIndex((i) => i?.$?.["android:name"] === name);
  const newItem = { $: { "android:name": name, "android:value": value } };

  if (existingIndex >= 0) {
    items[existingIndex] = newItem;
  } else {
    items.push(newItem);
  }

  application["meta-data"] = items;
}

module.exports = {
  uniq,
  boolToAndroidString,
  addOrReplaceManifestMetaData,
  ensureArray,
};


