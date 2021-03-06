
'use strict';

var Chance = require('chance'),
    sessionPage = require('./pages/session'),
    MenuPage = require('./pages/menu'),
    SwellRTPage = require('./pages/swellrt'),
    chance = new Chance(),
    loginPage = new sessionPage.Login(),
    initPage = new sessionPage.Init(),
    logoutPage = new sessionPage.Logout(),
    registerPage = new sessionPage.Register(),
    forgottenPasswordPage = new sessionPage.ForgottenPassword(),
    recoverPasswordPage = new sessionPage.RecoverPassword(),
    menu = new MenuPage(),
    swellrt = new SwellRTPage();

describe('Teem', function() {

  describe('login form', function() {
    it('should login existing user', function() {
      loginPage.get();

      loginPage.login();

      loginPage.expectNoErrors();

      expect(menu.currentNick()).toBe(loginPage.default.nick);
    });
  });

  describe('register form', function() {
    it('should register new user', function() {
      var nick = chance.word({ length: 10 });

      registerPage.get();

      registerPage.register({ nick: nick });

      registerPage.expectNoErrors();

      expect(menu.currentNick()).toBe(nick);
    });
  });

  describe('forgotten and recover password form', function() {
    it('should allow a new user to recover her password', function() {
      var nick = chance.word({ length: 10 }),
          email = chance.email(),
          newPassword = chance.word({ length: 10 });

      registerPage.get();

      registerPage.register({
        nick: nick,
        email: email
      });

      registerPage.expectNoErrors();

      // User must be logged out to test this functionality
      logoutPage.get();

      forgottenPasswordPage.get();

      forgottenPasswordPage.recover({ email: email});

      // In dev mode, there is not SMTP server
      // SwellRT waits for the timeout to respond and then shows and
      // error, so we cannot check this
      // forgottenPasswordPage.expectNoErrors();

      expect(swellrt.recoveryLink(nick)).toMatch('http.*' + swellrt.recoveryPath);

      recoverPasswordPage.get(nick);

      recoverPasswordPage.recover({ password: newPassword });

      recoverPasswordPage.expectNoErrors();

      loginPage.get();

      loginPage.login({
        nick: nick,
        password: newPassword
      });

      loginPage.expectNoErrors();

      expect(menu.currentNick()).toBe(nick);
    });
  });


  describe('when authenticated', () => {

    beforeEach(() => {
      loginPage.get();
      loginPage.login();
    });

    describe('session init', () => {

      beforeAll(() => {

        initPage.get();
      });

      it('should not show session form', () => {
        expect(loginPage.formElement.isPresent()).toBeFalsy();
      });

      it('should not show session form', () => {
        expect(menu.currentNick()).toBe(loginPage.default.nick);
      });
    });
  });

  describe('when not authenticated', () => {

    beforeEach(() => {

      logoutPage.get();
    });

    describe('session init', () => {

      beforeEach(() => {

        initPage.get();
      });

      it('should login existing user', function() {

        loginPage.login();

        loginPage.expectNoErrors();

        expect(menu.currentNick()).toBe(loginPage.default.nick);
      });
    });
  });

  describe('logout url', function() {
    it('should logout', function() {
      loginPage.get();

      loginPage.login();

      loginPage.expectNoErrors();

      logoutPage.get();

      expect(menu.isLoggedIn()).toBeFalsy();
    });
  });
});
