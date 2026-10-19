import { addDoc, collection } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import toast from "react-hot-toast";
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
} from "@chakra-ui/react";
import { IoIosAdd } from "react-icons/io";

function AddCategory() {
  const [categoryInput, setCategoryInput] = useState({
    title: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();

  const addRef = useRef(null)

  useEffect(()=>{
    function callBack(e){
      if(document.activeElement === addRef.current) return
      if(e.code === "Enter"){
        addRef.current.click()
        setCategoryInput({
          title:""
        })}}
        document.addEventListener("keydown",callBack)
        return ()=> document.removeEventListener("keydown",callBack)
  },[])

  function handleFieldUpdate(e) {
    const { name, value } = e.target;
    setCategoryInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError({});
  }
  async function handleAddCategory(e) {
    e.preventDefault();

    const newError = {};
    const { title } = categoryInput;
    if (!title.trim()) {
      newError.title = "Please add title";
    }
    setError(newError);
    if (Object.keys(newError).length > 0) return;
    try {
      setError({});
      setLoading(true);

      const categoryRef = collection(db, "categories");
      const newCategory = {
        title,
        createdOn: new Date(),
      };
      await addDoc(categoryRef, newCategory);
      onClose();
      setCategoryInput({
        title:""
      })
      toast.success("Category added");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <Button onClick={onOpen} bg={"#1F6B57"} color={"#fff"}><IoIosAdd /> New category</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <form onSubmit={handleAddCategory} id="formInput">
        <ModalContent>
          <ModalHeader>New category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  name="title"
                  placeholder="work"
                  value={categoryInput.title}
                  onChange={handleFieldUpdate}
                />
                {error.title && <p className="errMsg">{error.title}</p>}
              </FormControl>
            
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
            ref={addRef}
              variant="ghost"
              type="submit"
              form="formInput"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </Button>
          </ModalFooter>
        </ModalContent>
        </form>
      </Modal>
    </div>
  );
}

export default AddCategory;
