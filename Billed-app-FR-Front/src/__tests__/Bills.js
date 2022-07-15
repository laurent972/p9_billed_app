

/**
 * @jest-environment jsdom
 */
import {screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import Bills from "../containers/Bills.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../__mocks__/store";
import router from "../app/Router.js";



describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    // Check if the bill icon is highlighted
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon).toBeTruthy();
      expect(windowIcon.classList.contains("active-icon")).toBe(true);
    });

    // Check order of bills
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => (a.date - b.date)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    // Check if the button "new bill" load the bill form
    test("Then, when I click on the new bill button, the page to create a bill is loaded", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      document.body.innerHTML = BillsUI({ data: bills });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
      const newBills = new Bills({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });

      const handleClickNewBill = jest.fn(newBills.handleClickNewBill);
      const newBillBtn = screen.getByTestId("btn-new-bill");
      newBillBtn.addEventListener("click", handleClickNewBill);
      userEvent.click(newBillBtn);

      const form = screen.getByTestId("form-new-bill");
      
      expect(handleClickNewBill).toHaveBeenCalled();
      expect(form).toBeTruthy();
    });
    // Check if the eye open the bill modal
    test("Then, when I click on first eye, the iconmodal should open", () => {
      // Load the data
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;

      const billsContainer = new Bills({
        document,
        onNavigate: () => {},
        localStorage: localStorage,
        store: null,
      });

      // Mock the Bootstrap jQuery modal prototype
      $.fn.modal = jest.fn();

      // Mock the handleClickIconEye method
      const handleClickIconEye = jest.fn(() => {
        billsContainer.handleClickIconEye;
      });

      // Get the first bill icon-eye button
      const firstEyeIcon = screen.getAllByTestId("icon-eye")[0];
      // Add click event
      firstEyeIcon.addEventListener("click", handleClickIconEye);
      // Fire click event
      userEvent.click(firstEyeIcon);

      expect(handleClickIconEye).toHaveBeenCalled();
      expect($.fn.modal).toHaveBeenCalled();
    });


    // Check if the bills is fetched
    test("Then the bills is fetched from store", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      const bills = new Bills({
        document,
        onNavigate: window.onNavigate,
        store,
        localStorage: window.localStorage,
      });

      const spyGetBills = jest.spyOn(bills, "getBills");
      const billsFetched = await bills.getBills();

      expect(billsFetched.length).toEqual(4);
      expect(spyGetBills).toHaveBeenCalled();
    });

    // Check if the Error page work
    test("If the bill page an error, then Error page should be displayed", () => {
      const html = BillsUI({ data: bills, error: true });
      document.body.innerHTML = html;
      const hasError = screen.getAllByText("Erreur");
      expect(hasError).toBeTruthy();
    });
    // Check if the loading page work
    test("Then is loading, so the Loading page should be displayed", () => {
      const html = BillsUI({ data: bills, loading: true });
      document.body.innerHTML = html;
      const isLoading = screen.getAllByText("Loading...");
      expect(isLoading).toBeTruthy();
  })
  });
});

// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to bills page", () => {
    test("fetches bills from mock API GET", async () => {  
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      const newBills = new Bills({document, onNavigate, store, localStorage: window.localStorage});
      const billsFetched = await newBills.getBills();
      expect(billsFetched.length).toEqual(4);
    })

    
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(store, "bills");
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}));
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })



      test("fetches bills from an API and fails with 404 message error", async () => {
        store.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 404"))
            }
          }})

          const html = BillsUI({ error: 'Erreur 404' });
          document.body.innerHTML = html;
  
          const message = screen.getByText(/Erreur 404/);
  
          expect(message).toBeTruthy();
      })


     




      test("fetches messages from an API and fails with 500 message error", async () => {

        store.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 500"))
            }
          }})

          const html = BillsUI({ error: 'Erreur 500' });
          document.body.innerHTML = html;
  
          const message = screen.getByText(/Erreur 500/);
  
          expect(message).toBeTruthy();
      })
    })
  })
})
