import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { initializeApp, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, addDoc, collection, updateDoc, doc, onSnapshot, getDoc, setDoc, query, where, getDocs, Unsubscribe, DocumentData, deleteDoc, Firestore} from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes, FirebaseStorage } from "firebase/storage";
import { createUserWithEmailAndPassword, deleteUser, signInAnonymously, signOut, signInWithEmailAndPassword, initializeAuth, indexedDBLocalPersistence, UserCredential, Auth, User } from "firebase/auth";

export interface FirebaseStorageFile{
  path:string,
  file:string
};

export interface FirebaseDocument{
  id:string;
  data:DocumentData;
}


export interface FirebaseUserCredential{
  user:UserCredential
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private _app!: FirebaseApp;
  private _db!: Firestore;
  private _auth!:Auth;
  private _webStorage!:FirebaseStorage;
  private _user:User|null = null;
  private _isLogged:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLogged$:Observable<boolean> = this._isLogged.asObservable();
  
  constructor(
    @Inject('firebase-config') config:any
  ) {
    this.init(config);
  }
  
  public async init(firebaseConfig: any) {
    // Inicializar Firebase
    this._app = initializeApp(firebaseConfig); // Inicializar la aplicación Firebase
    this._db = getFirestore(this._app); // Inicializar Firestore (base de datos) utilizando la instancia de la aplicación
    this._webStorage = getStorage(this._app); // Inicializar Firebase Cloud Storage utilizando la instancia de la aplicación
    this._auth = initializeAuth(getApp(), { persistence: indexedDBLocalPersistence }); // Inicializar la autenticación de Firebase con opciones de persistencia utilizando la instancia de la aplicación y opciones específicas
    this._auth.onAuthStateChanged(async user => {
      // Configurar un listener para cambios en el estado de autenticación del usuario
      this._user = user; // Almacenar el usuario actual en la propiedad _user
      if (user) {
        if (user.uid && user.email) {
          // Si el usuario tiene un UID y un correo electrónico
          this._isLogged.next(true); // Notificar que el usuario está autenticado
        }
      } else {
        // Si no hay usuario (el usuario cierra sesión)
        this._isLogged.next(false); // Notificar que el usuario no está autenticado
      }
    });
  }

  public fileUpload(blob: Blob, mimeType: string, path: string, prefix: string, extension: string): Promise<FirebaseStorageFile> {
    return new Promise(async (resolve, reject) => {
      // Verificar si las conexiones a Firebase Storage y Auth existen
      if (!this._webStorage || !this._auth)
        reject({
          msg: "No conectado a FireStorage"
        });
      var freeConnection = false;
      // Si hay conexión a Auth pero no hay usuario autenticado
      if (this._auth && !this._auth.currentUser) {
        try {
          // Intentar iniciar sesión anónimamente
          await signInAnonymously(this._auth);
          freeConnection = true;
        } catch (error) {
          // Manejar el error si no se puede iniciar sesión
          reject(error);
        }
      }
      // Construir la URL del archivo en Firebase Storage
      const url = path + "/" + prefix + "-" + Date.now() + extension;
      const storageRef = ref(this._webStorage!, url);
      const metadata = {
        contentType: mimeType,
      };
      // Subir el archivo al almacenamiento en la nube
      uploadBytes(storageRef, blob).then(async (snapshot) => {
        // Obtener la URL de descarga del archivo
        getDownloadURL(storageRef).then(async downloadURL => {
          // Cerrar sesión si se inició sesión anónimamente
          if (freeConnection)
              await signOut(this._auth!);
          // Resolver la promesa con la información del archivo
          resolve({
            path,
            file: downloadURL,
          });
        }).catch(async error => {
          // Cerrar sesión si se inició sesión anónimamente y ocurrió un error
          if (freeConnection)
            await signOut(this._auth!);
          // Rechazar la promesa con el error
          reject(error);
        });
      }).catch(async (error) => {
        // Cerrar sesión si se inició sesión anónimamente y ocurrió un error
        if (freeConnection)
          await signOut(this._auth!);
        // Rechazar la promesa con el error
        reject(error);
      });
    });
  }

  public imageUpload(blob: Blob): Promise<any> {
    // Llamar a la función fileUpload con los parámetros específicos para imágenes
    return this.fileUpload(blob, 'image/jpeg', 'images', 'image', '.jpg');
  }

  public createDocument(collectionName: string, data: any): Promise<string> {
    // Devolver una nueva promesa para manejar la operación asincrónica
    return new Promise((resolve, reject) => {
      // Verificar si la conexión a la base de datos existe
      if (!this._db)
        reject({
          msg: "La base de datos no está conectada"
        });
      // Obtener la referencia a la colección especificada en el parámetro
      const collectionRef = collection(this._db!, collectionName);
      // Añadir un documento a la colección con los datos proporcionados
      addDoc(collectionRef, data)
        .then(docRef => resolve(docRef.id)) // Resolver la promesa con el ID del documento recién creado
        .catch(err => reject(err)); // Rechazar la promesa con el error, si ocurre alguno durante la operación
    });
  }

  public createDocumentWithId(collectionName: string, data: any, docId: string): Promise<void> {
    // Devolver una nueva promesa para manejar la operación asincrónica
    return new Promise((resolve, reject) => {
      // Verificar si la conexión a la base de datos existe
      if (!this._db) {
        reject({
          msg: 'La base de datos no está conectada',
        });
      }
      // Obtener la referencia al documento específico utilizando el ID proporcionado
      const docRef = doc(this._db!, collectionName, docId);
      // Establecer los datos del documento con los datos proporcionados
      setDoc(docRef, data)
        .then(() => resolve()) // Resolver la promesa si la operación es exitosa
        .catch((err) => reject(err)); // Rechazar la promesa con el error, si ocurre alguno durante la operación
    });
  }

  public updateDocument(collectionName: string, document: string, data: any): Promise<void> {
    // Devolver una nueva promesa para manejar la operación asincrónica
    return new Promise(async (resolve, reject) => {
      // Verificar si la conexión a la base de datos existe
      if (!this._db) {
        reject({
          msg: 'La base de datos no está conectada',
        });
      }
      // Obtener la referencia a la colección especificada en el parámetro
      const collectionRef = collection(this._db!, collectionName);
      try {
        // Actualizar el documento con los datos proporcionados
        await updateDoc(doc(collectionRef, document), data);
        resolve(); // Resolver la promesa si la operación es exitosa
      } catch (err) {
        reject(err); // Rechazar la promesa con el error, si ocurre alguno durante la operación
      }
    });
  }

  public getDocuments(collectionName: string): Promise<FirebaseDocument[]> {
    // Devolver una nueva promesa para manejar la operación asincrónica
    return new Promise(async (resolve, reject) => {
      // Verificar si la conexión a la base de datos existe
      if (!this._db) {
        reject({
          msg: 'La base de datos no está conectada',
        });
      }
      try {
        // Obtener una instantánea de los documentos en la colección
        const querySnapshot = await getDocs(collection(this._db!, collectionName));
        // Resolver la promesa con un array de objetos {id, data} representando los documentos
        resolve(querySnapshot.docs.map<FirebaseDocument>(doc => {
          return { id: doc.id, data: doc.data() };
        }));
      } catch (err) {
        // Rechazar la promesa con el error, si ocurre alguno durante la operación
        reject(err);
      }
    });
  }

  public getDocument(collectionName: string, document: string): Promise<FirebaseDocument> {
    // Devolver una nueva promesa para manejar la operación asincrónica
    return new Promise(async (resolve, reject) => {
      // Verificar si la conexión a la base de datos existe
      if (!this._db) {
        reject({
          msg: 'La base de datos no está conectada',
        });
      }
      // Obtener la referencia al documento específico utilizando el ID proporcionado
      const docRef = doc(this._db!, collectionName, document);
      try {
        // Obtener una instantánea del documento
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // Si el documento existe, resolver la promesa con un objeto {id, data} representando el documento
          resolve({ id: docSnap.id, data: docSnap.data() });
        } else {
          // Si el documento no existe, rechazar la promesa con un mensaje de error
          reject('El documento no existe');
        }
      } catch (err) {
        // Rechazar la promesa con el error, si ocurre alguno durante la operación
        reject(err);
      }
    });
  }

  public getDocumentsBy(collectionName: string, field: string, value: any): Promise<FirebaseDocument[]> {
    // Devolver una nueva promesa para manejar la operación asincrónica
    return new Promise(async (resolve, reject) => {
      // Verificar si la conexión a la base de datos existe
      if (!this._db) {
        reject({
          msg: 'La base de datos no está conectada',
        });
      }
      // Crear una consulta que filtre los documentos donde el campo especificado sea igual al valor proporcionado
      const q = query(collection(this._db!, collectionName), where(field, '==', value));
      try {
        // Obtener una instantánea de los documentos que cumplen con la condición de la consulta
        const querySnapshot = await getDocs(q);
        // Resolver la promesa con un array de objetos {id, data} representando los documentos
        resolve(querySnapshot.docs.map<FirebaseDocument>(doc => {
          return { id: doc.id, data: doc.data() };
        }));
      } catch (err) {
        // Rechazar la promesa con el error, si ocurre alguno durante la operación
        reject(err);
      }
    });
  }

  public deleteDocument(collectionName: string, docId: string): Promise<void> {
    // Devolver una nueva promesa para manejar la operación asincrónica
    return new Promise(async (resolve, reject) => {
      // Verificar si la conexión a la base de datos existe
      if (!this._db) {
        reject({
          msg: 'La base de datos no está conectada',
        });
      }
      try {
        // Eliminar el documento con el ID proporcionado de la colección especificada
        resolve(await deleteDoc(doc(this._db!, collectionName, docId)));
      } catch (err) {
        // Rechazar la promesa con el error, si ocurre alguno durante la operación
        reject(err);
      }
    });
  }

  public subscribeToCollection(collectionName: string, subject: BehaviorSubject<any[]>,
    mapFunction: (el: DocumentData) => any): Unsubscribe | null {
    // Verificar si la conexión a la base de datos existe
    if (!this._db) {
      return null; // Devolver null si la base de datos no está conectada
    }
    // Configurar un listener para cambios en la colección
    return onSnapshot(collection(this._db, collectionName), (snapshot) => {
      // Actualizar el BehaviorSubject con los datos transformados utilizando la función de mapeo
      subject.next(snapshot.docs.map<any>(doc => mapFunction(doc)));
    }, error => {});
  }

  public async signOut(signInAnon: boolean = false): Promise<void> {
    // Devolver una nueva promesa para manejar la operación asincrónica
    return new Promise<void>(async (resolve, reject) => {
      // Verificar si la conexión a la autenticación existe
      if (this._auth) {
        try {
          // Cerrar sesión
          await this._auth.signOut();
          // Si se proporciona la bandera signInAnon, intentar iniciar sesión anónimamente después de cerrar sesión
          if (signInAnon)
            await this.connectAnonymously();
          resolve(); // Resolver la promesa si la operación es exitosa
        } catch (error) {
          reject(error); // Rechazar la promesa con el error, si ocurre alguno durante la operación
        }
      }
    });
  }

  public isUserConnected(): Promise<boolean> {
    // Devolver una nueva promesa para manejar la operación asincrónica
    const response = new Promise<boolean>(async (resolve, reject) => {
      // Verificar si la conexión a la autenticación existe
      if (!this._auth)
        resolve(false); // Resolver la promesa con false si la autenticación no está conectada
      resolve(this._auth!.currentUser != null); // Resolver la promesa con true si hay un usuario autenticado, de lo contrario, con false
    });
    return response;
  }

  public isUserConnectedAnonymously(): Promise<boolean> {
    // Devolver una nueva promesa para manejar la operación asincrónica
    const response = new Promise<boolean>(async (resolve, reject) => {
      // Verificar si la conexión a la autenticación existe
      if (!this._auth)
        resolve(false); // Resolver la promesa con false si la autenticación no está conectada
      // Resolver la promesa con true si hay un usuario autenticado y es anónimo, de lo contrario, con false
      resolve(this._auth!.currentUser != null && this._auth!.currentUser.isAnonymous);
    });
    return response;
  }

  public async connectAnonymously(): Promise<void> {
    // Devolver una nueva promesa para manejar la operación asincrónica
    const response = new Promise<void>(async (resolve, reject) => {
      // Verificar si la conexión a la autenticación existe
      if (!this._auth)
        resolve(); // Resolver la promesa si la autenticación no está conectada
      try {
        // Verificar si no hay usuario conectado o si el usuario conectado no es anónimo
        if (!(await this.isUserConnected()) && !(await this.isUserConnectedAnonymously())) {
          await signInAnonymously(this._auth!); // Iniciar sesión anónimamente
          resolve(); // Resolver la promesa después de iniciar sesión anónimamente
        } else if (await this.isUserConnectedAnonymously()) {
          resolve(); // Resolver la promesa si ya hay un usuario conectado anónimamente
        } else {
          reject({ msg: "Ya hay un usuario conectado" }); // Rechazar la promesa si ya hay un usuario conectado (no anónimo)
        }
      } catch (error) {
        reject(error); // Rechazar la promesa con el error, si ocurre alguno durante la operación
      }
    });
    return response;
  }

  public async createUserWithEmailAndPassword(email: string, password: string): Promise<FirebaseUserCredential | null> {
    // Devolver una nueva promesa para manejar la operación asincrónica
    return new Promise(async (resolve, reject) => {
      // Verificar si la conexión a la autenticación existe
      if (!this._auth)
        resolve(null); // Resolver la promesa con null si la autenticación no está conectada
      try {
        // Intentar crear un usuario con el correo electrónico y la contraseña proporcionados
        resolve({ user: await createUserWithEmailAndPassword(this._auth!, email, password) });
      } catch (error: any) {
        // Manejar diferentes códigos de error y mostrar mensajes específicos
        switch (error.code) {
          case 'auth/email-already-in-use':
            console.log(`La dirección de correo electrónico ${email} ya está en uso.`);
            break;
          case 'auth/invalid-email':
            console.log(`La dirección de correo electrónico ${email} no es válida.`);
            break;
          case 'auth/operation-not-allowed':
            console.log(`Error durante el registro.`);
            break;
          case 'auth/weak-password':
            console.log('La contraseña no es lo suficientemente fuerte. Agrega caracteres adicionales, incluyendo caracteres especiales y números.');
            break;
          default:
            console.log(error.message);
            break;
        }
        reject(error); // Rechazar la promesa con el error, si ocurre alguno durante la operación
      }
    });
  }

  public async connectUserWithEmailAndPassword(email: string, password: string): Promise<FirebaseUserCredential | null> {
    // Devolver una nueva promesa para manejar la operación asincrónica
    return new Promise<FirebaseUserCredential | null>(async (resolve, reject) => {
      // Verificar si la conexión a la autenticación existe
      if (!this._auth)
        resolve(null); // Resolver la promesa con null si la autenticación no está conectada
      try {
        // Iniciar sesión con el correo electrónico y la contraseña proporcionados
        resolve({ user: await signInWithEmailAndPassword(this._auth!, email, password) });
      } catch (error) {
        reject(error); // Rechazar la promesa con el error, si ocurre alguno durante la operación
      }
    });
  }

  public deleteUser(): Promise<void> {
    // Devolver una nueva promesa para manejar la operación asincrónica
    return new Promise<void>((resolve, reject) => {
      // Verificar si hay un usuario autenticado
      if (!this._user)
        reject(); // Rechazar la promesa si no hay usuario autenticado
      try {
        // Eliminar el usuario autenticado
        resolve(deleteUser(this._user!));
      } catch (error) {
        reject(error); // Rechazar la promesa con el error, si ocurre alguno durante la operación
      }
    });
  }

  public updateDocumentField(collectionName: string, document: string, fieldName: string, fieldValue: any): Promise<void> {
    // Devolver una nueva promesa para manejar la operación asincrónica
    return new Promise(async (resolve, reject) => {
      // Verificar si la conexión a la base de datos existe
      if (!this._db) {
        reject({
          msg: "La base de datos no está conectada"
        });
      }
      // Obtener la referencia al documento específico utilizando el ID proporcionado
      const documentRef = doc(this._db as Firestore, collectionName, document);
      // Crear un objeto con el campo a actualizar
      const fieldUpdate = { [fieldName]: fieldValue };
      try {
        // Actualizar el documento con el nuevo valor del campo
        await updateDoc(documentRef, fieldUpdate);
        resolve(); // Resolver la promesa si la operación es exitosa
      } catch (error) {
        reject(error); // Rechazar la promesa con el error, si ocurre alguno durante la operación
      }
    });
  }
}