import { defineStore } from "pinia";
import { 
  createUserWithEmailAndPassword,
  doc,
  setDoc,
  db,
  auth,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from '@/includes/firebase';

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false,
  }),
  actions: {
    async register(values) {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );

      // await addDoc(collection(db, "users"), {
      //   name: values.name,
      //   email: values.email,
      //   age: values.age,
      //   country: values.country,
      // });
      await setDoc(doc(db, "users", userCred.user.uid), {
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country,
      });

      await updateProfile(auth.currentUser, {
        displayName: values.name,
      });
      this.userLoggedIn = true;
    },
    async authenticate (values) {
      await signInWithEmailAndPassword(
        auth, 
        values.email, 
        values.password
      );
      this.userLoggedIn = true;
    },
    async signOut() {
      await signOut(auth);
      this.userLoggedIn = false;
    }
  },
});