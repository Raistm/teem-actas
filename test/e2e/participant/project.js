'use strict';

var projectPages = require('./../pages/project'),
    sessionPages = require('./../pages/session'),
    ProfilePage = require('./../pages/profile'),
    projectPage = new projectPages.ProjectPage(),
    loginPage = new sessionPages.Login(),
    profilePage = new ProfilePage();

describe('Participant user', () => {

  beforeAll(() => {
    loginPage.get();
    loginPage.login(loginPage.participant);
  });

  describe('should be able to join a project', () => {
    beforeAll(() => {
      browser.get(global.defaultProject.url);
      projectPage.join();
    });

    it(', see the core user and herself as participants, and then leave it', () => {
      expect(projectPage.getParticipants()).toContain(loginPage.default.nick);
      expect(projectPage.getParticipants()).toContain(loginPage.participant.nick);

      projectPage.leave();

      expect(projectPage.getParticipants()).toContain(loginPage.default.nick);
      expect(projectPage.getParticipants()).not.toContain(loginPage.participant.nick);
    });

    xit(', see the project in her profile, and then leave it', () => {
      profilePage.get();
      expect(profilePage.getProjects().toContain(global.defaultProject.title));
      profilePage.leave(global.defaultProject);
      expect(profilePage.getProjects().toContain(global.defaultProject));
    });
  });
});