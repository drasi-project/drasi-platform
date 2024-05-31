use std::collections::{HashMap, BTreeMap};

use serde_json::{Value, json};
use tokio::sync::Mutex;



#[derive(Debug, Clone)]
pub struct DocumentElement {
    pub id: String,
    pub content: Value,
    pub label: String,
    pub parent: Option<String>,
}

pub struct Document {
    pub id: String,
    pub name: String,
    pub etag: String,
    pub elements: BTreeMap<String, DocumentElement>,
}

pub struct DocumentCache {
    documents: Mutex<HashMap<String, Document>>,
}

impl DocumentCache {
    pub fn new() -> Self {
        Self {
            documents: Mutex::new(HashMap::new()),
        }
    }

    //merge document
    pub async fn merge(&self, document_id: &str, new_document: Document) -> Vec<ElementDiff> {
        let mut documents = self.documents.lock().await;
        let document = documents.entry(document_id.to_string()).or_insert_with(|| Document {
            id: document_id.to_string(),
            name: new_document.name.clone(),
            etag: new_document.etag.clone(),
            elements: BTreeMap::new(),
        });
        document.merge(new_document)
    }

    pub async fn get_current_all(&self) -> Vec<ElementDiff> {
        let documents = self.documents.lock().await;
        let mut diffs = Vec::new();
        for (_, document) in &*documents {
            diffs.append(&mut document.get_current());
        }
        diffs
    }


}

#[derive(Debug)]
pub enum ElementDiff {
    Added(DocumentElement),
    Removed(DocumentElement),
    Changed(DocumentElement),
}

impl Document {
    pub fn new(id: String, name: String, etag: String, elements: BTreeMap<String, DocumentElement>) -> Self {
        Self {
            id,
            name,
            etag,
            elements,
        }
    }

    //merge the document with the new document and return diff
    pub fn merge(&mut self, new_document: Document) -> Vec<ElementDiff> {
        let mut diffs = Vec::new();

        //check for elements that are in both documents and have changed
        for (element_id, element) in &new_document.elements {
            if let Some(current_element) = self.elements.get_mut(element_id) {
                if current_element.content != element.content {
                    current_element.content = element.content.clone();                    
                    diffs.push(ElementDiff::Changed(element.clone()));
                }
            }
        }

        //remove elements that are not in the new document
        let mut elements_to_remove = Vec::new();
        for (element_id, element) in &self.elements {
            if !new_document.elements.contains_key(element_id) {
                elements_to_remove.push(element_id.clone());
                diffs.push(ElementDiff::Removed(element.clone()));
            }
        }
        for element_id in elements_to_remove {
            self.elements.remove(&element_id);
        }

        //add elements that are in the new document but not in the current document
        for (element_id, element) in &new_document.elements {
            if !self.elements.contains_key(element_id) {
                self.elements.insert(element_id.clone(), element.clone());
                diffs.push(ElementDiff::Added(element.clone()));
            }
        }        

        self.name = new_document.name;
        self.etag = new_document.etag;

        diffs.push(ElementDiff::Changed(DocumentElement {
            id: self.id.clone(),
            content: json!({
                "name": self.name,
                "etag": self.etag,
            }),
            label: "Document".to_string(),
            parent: None,
        }));

        diffs
    }

    pub fn get_current(&self) -> Vec<ElementDiff> {
        let mut diffs = Vec::new();

        for (_, element) in &self.elements {
            diffs.push(ElementDiff::Added(element.clone()));
        }

        diffs.push(ElementDiff::Added(DocumentElement {
            id: self.id.clone(),
            content: json!({
                "name": self.name,
                "etag": self.etag,
            }),
            label: "Document".to_string(),
            parent: None,
        }));

        diffs
    }

}