/**
 * @jest-environment jsdom
 */

 import {screen, waitFor, fireEvent} from "@testing-library/dom";
 import {localStorageMock} from "../__mocks__/localStorage.js";
 import router from "../app/Router.js";
 import {ROUTES_PATH} from "../constants/routes.js";
 import NewBill from "../containers/NewBill.js";
 import NewBillUI from "../views/NewBillUI.js";
import mockStore from "../__mocks__/store"
import { bills } from "../fixtures/bills";
import {ROUTES} from "../constants/routes";
import firebase from '../__mocks__/firebase';

const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({
    pathname
  })
}

Object.defineProperty(window, 'localStorage', { value: localStorageMock })
window.localStorage.setItem('user', JSON.stringify({
  type: 'Employee'
}))


// describe("Given I am connected as an employee", () => {
//   describe("When I am on NewBill Page", () => {
//     test("Then ...", () => {
//       const html = NewBillUI()
//       document.body.innerHTML = html
//       //to-do write assertion
//     })
//   })
// })


// testing add newTicket
describe("Given I am connected as an employee", () => {
  
  describe("When I am on NewBill i want to load an incorrect file", () => {
    test("Then image is not loaded", () => {
      // create NewBill UI
      const html = NewBillUI()
      // Insert NewBill UI in the body
      document.body.innerHTML = html
      // Image name
      const fileName = "test.svg"
      // input element screen simule document.body
      const file = screen.getByTestId("file");
      // get extension image format
      const extension = fileName.split(".").pop() // SVG
      // error message element
      const error = document.getElementById("wrongFormat")
      // error message
      const errorMessage = "Extensions autorisées : jpg, jpeg ou png"
      
      // Instanciation of NewBill class
      const newBill = new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: localStorageMock
      })
      // mock handleChangeFile method
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      // add Event on change when input load file
      file.addEventListener("change", handleChangeFile)
    
      fireEvent.change(file, {
        target: {
          files: [new File([fileName], fileName, {
            type: `${extension}`
          })],
        },
      })
      // handleChangeFile call
      expect(handleChangeFile).toHaveBeenCalled();
      // file loaded has jpg extension
      expect(errorMessage).not.toBeNull();
      expect(errorMessage).toBe("Extensions autorisées : jpg, jpeg ou png")
    

    })


///EXEMPLE DE TEST d'AJOUT d'une Facture
    describe('when i am on newbill page, i want to add a bill', () =>{
      test('A bill should be added', () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        
          //je  récupère ma fonction
          const html = NewBillUI();
          //je la defini en tant qu'entité dans le html body
          document.body.innerHTML = html;
          //Calling functions with parameters
          const newBill = new NewBill({document, onNavigate, mockStore, localStorageMock});
          // Je récupère la fonction de création du bill
          const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
          // je récupère le formulaire à valider
          const submit = screen.getByTestId('form-new-bill');
          //je lance la validation du formulaire test
          submit.addEventListener('submit', handleSubmit);
          fireEvent.submit(submit);
          //assurer que la fonction simulée a été appelée
          expect(handleSubmit).toHaveBeenCalled();
      })
    })

  }) })

  // POST
describe('Given I am connected as an employee', () => {
  describe('When I create a new bill', () => {
      test('Add bill to mock API POST', async () => {
          const getSpyPost = jest.spyOn(firebase, 'post');

          // Init newBill
          const newBill = {
              id: 'eoKIpYhECmaZAGRrHjaC',
              status: 'refused',
              pct: 10,
              amount: 500,
              email: 'john@doe.com',
              name: 'Facture 236',
              vat: '60',
              fileName: 'preview-facture-free-201903-pdf-1.jpg',
              date: '2021-03-13',
              commentAdmin: 'à valider',
              commentary: 'A déduire',
              type: 'Restaurants et bars',
              fileUrl: 'https://saving.com',
          };
          const bills = await firebase.post(newBill);

          // getSpyPost must have been called once
          expect(getSpyPost).toHaveBeenCalledTimes(1);
          // The number of bills must be 5 
          expect(bills.data.length).toBe(5);
      });

  

    
})});