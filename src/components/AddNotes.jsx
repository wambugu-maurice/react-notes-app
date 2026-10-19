import { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../firebase";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import { IoIosAdd } from "react-icons/io";
import useCategories from "../hooks/useCategories";

function AddNotes() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notesInput, setNotesInput] = useState({
    title: "",
    body: "",
    category: "",
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const { categories } = useCategories();

  const inputRef = useRef(null);

  useEffect(() => {
    function callBack(e) {
      if (document.activeElement === inputRef.current) return;
      if (e.code === "Enter") {
        inputRef.current.focus();
      }
    }
    document.addEventListener("keydown", callBack);
    return () => document.removeEventListener("keydown", callBack);
  }, []);

  function handleFieldUpdate(e) {
    const { name, value } = e.target;
    setNotesInput((formInput) => ({
      ...formInput,
      [name]: value,
    }));
    setError({});
  }

  function handleBodyUpdate(body) {
    setNotesInput((formInput) => ({
      ...formInput,
      body,
    }));
    setError({});
  }
  async function handleNotesSave(e) {
    e.preventDefault();

    const newErrors = {};
    const { title, category, body } = notesInput;

    if (!title.trim()) {
      newErrors.title = "Please enter a title";
    }
    if (!category.trim()) {
      newErrors.category = "Please choose a category";
    }
    if (!body.trim()) {
      newErrors.body = "Please add notes";
    }
    setError(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      const notesRef = collection(db, "notes");
      const newNote = {
        title,
        category,
        body,
        addedOn: new Date(),
        addedBy: auth.currentUser.uid,
        isLiked: false,
        deletedAt: null
      };
      await addDoc(notesRef, newNote);
      onClose();
      setNotesInput({
        title: "",
        body: "",
        category: "",
      });
      toast.success("Notes added");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="AddNotes">
      <Button onClick={onOpen} bg={"#1F6B57"} color={"#fff"}>
        <IoIosAdd /> New note
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleNotesSave} id="notesInput">
          <ModalContent>
            <ModalHeader>New note</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  name="title"
                  placeholder="note 1"
                  ref={inputRef}
                  value={notesInput.title}
                  onChange={handleFieldUpdate}
                  margin={"7px"}
                />
                {error.title && <p className="errMsg">{error.title}</p>}
              </FormControl>
              <FormControl>
                <Select
                  placeholder="Select option"
                  value={notesInput.category}
                  onChange={handleFieldUpdate}
                  name="category"
                  margin={"7px"}
                >
                  {categories?.map((category) => (
                    <option key={category.id} value={category.title}>
                      {category.title}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <ReactQuill
                  theme="snow"
                  value={notesInput.body}
                  onChange={handleBodyUpdate}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                variant="ghost"
                disabled={loading}
                type="submit"
                form="notesInput"
              >
                {loading ? "Addning note..." : "Add"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </div>
  );
}

export default AddNotes;
