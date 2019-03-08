import { AppiumDriver, createDriver } from "nativescript-dev-appium";

import { Screen, playersData, home, somePage, teamsData, driverDefaultWaitTime, stillOtherPage } from "./screen";
import * as shared from "./shared.e2e-spec";
import { suspendTime, appSuspendResume, dontKeepActivities, transitions } from "./config";

describe("frame-root:", () => {
    let driver: AppiumDriver;
    let screen: Screen;

    before(async () => {
        driver = await createDriver();
        screen = new Screen(driver);
        if (dontKeepActivities) {
            await driver.setDontKeepActivities(true);
        }

        driver.defaultWaitTime = driverDefaultWaitTime;
    });

    after(async () => {
        if (dontKeepActivities) {
            await driver.setDontKeepActivities(false);
        }
        await driver.quit();
        console.log("Quit driver!");
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    transitions.forEach(transition => {
        const playerOne = playersData[`playerOne${transition}`];
        const playerTwo = playersData[`playerTwo${transition}`];
        const teamOne = teamsData[`teamOne${transition}`];
        const teamTwo = teamsData[`teamTwo${transition}`];

        describe(`transition: ${transition} scenarios:`, () => {
            it("loaded home page", async () => {
                await screen.loadedHome();
            });
        
            it("loaded frame root with nested frame", async () => {
                await screen.navigateToPageWithFrame();
                await screen.loadedPageWithFrame();
            });
        
            it("loaded players list", async () => {
                await screen.loadedPlayersList();
            });
        
            it("loaded player details and go back twice", async () => {
                await shared.testPlayerNavigated(playerTwo, screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(suspendTime);
                    await driver.waitForElement(playerTwo.name) // wait for player
                }
                
                await shared.testPlayerNavigatedBack(screen, driver);

                if (appSuspendResume) {
                    await driver.backgroundApp(suspendTime);
                    await driver.waitForElement(playerOne.name) // wait for players list
                }
        
                await shared.testPlayerNavigated(playerTwo, screen);
                await shared.testPlayerNavigatedBack(screen, driver);
            });
        
            it("navigate parent frame and go back", async () => {
                await shared[`testSomePageNavigated${transition}`](screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(suspendTime);
                    await driver.waitForElement(somePage); // wait for some page
                }
                
                if (driver.isAndroid) {
                    await driver.navBack(); // some page back navigation
                } else {
                    await screen.goBackFromSomePage();
                }

                await screen.loadedPlayersList();
            });
        
            it("loaded player details and navigate parent frame and go back", async () => {
                await shared.testPlayerNavigated(playerTwo, screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(suspendTime);
                    await driver.waitForElement(playerTwo.name); // wait for player
                }

                await shared[`testSomePageNavigated${transition}`](screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(suspendTime);
                    await driver.waitForElement(somePage); // wait for some page
                }
        
                if (driver.isAndroid) {
                    await driver.navBack(); // some page back navigation
                } else {
                    await screen.goBackFromSomePage();
                }

                await screen.loadedPlayerDetails(playerTwo);
        
                await screen.goBackToPlayersList();
                await screen.loadedPlayersList();
            });
        
            it("loaded home page again", async () => {
                await screen.goBackFromFrameHome();
                await screen.loadedHome();

                if (appSuspendResume) {
                    await driver.backgroundApp(suspendTime);
                    await driver.waitForElement(home); // wait for home page
                }
            });
        
            it("loaded frame root with multi nested frames", async () => {
                await screen.navigateToPageWithMultiFrame();
                await screen.loadedPageWithMultiFrame();
            });
        
            it("loaded players list", async () => {
                await screen.loadedPlayersList();
            });
        
            it("loaded teams list", async () => {
                await screen.loadedTeamsList();
            });
        
            it("loaded player details and go back twice", async () => {
                await shared.testPlayerNavigated(playerTwo, screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(suspendTime);
                    await driver.waitForElement(playerTwo.name) // wait for player
                }

                await shared.testPlayerNavigatedBack(screen, driver);

                if (appSuspendResume) {
                    await driver.backgroundApp(suspendTime);
                    await driver.waitForElement(playerOne.name) // wait for players list
                }
        
                await shared.testPlayerNavigated(playerTwo, screen);
                await shared.testPlayerNavigatedBack(screen, driver);
            });
        
            it("navigate players parent frame and go back", async () => {
                await shared[`testSomePageNavigated${transition}`](screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(suspendTime);
                    await driver.waitForElement(somePage); // wait for some page
                }
        
                if (driver.isAndroid) {
                    await driver.navBack(); // some page back navigation
                } else {
                    await screen.goBackFromSomePage();
                }
                
                await screen.loadedPlayersList();
            });
        
            it("loaded players details and navigate parent frame and go back", async () => {
                await shared.testPlayerNavigated(playerTwo, screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(suspendTime);
                    await driver.waitForElement(playerTwo.name); // wait for player
                }

                await shared[`testSomePageNavigated${transition}`](screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(suspendTime);
                    await driver.waitForElement(somePage); // wait for some page
                }
        
                if (driver.isAndroid) {
                    await driver.navBack(); // some page back navigation
                } else {
                    await screen.goBackFromSomePage(); 
                }

                await screen.loadedPlayerDetails(playerTwo);
                await screen.loadedTeamsList(); // assert visible & no changes
        
                await screen.goBackToPlayersList();
                await screen.loadedPlayersList();
            });
        
            it("loaded frame root with multi nested frames again", async () => {
                await screen.loadedPageWithMultiFrame();
            });
        
            it("loaded players list", async () => {
                await screen.loadedPlayersList();
            });
        
            it("loaded teams list", async () => {
                await screen.loadedTeamsList();
            });
        
            it ("mix player and team list actions and go back", async () => {
                await shared.testPlayerNavigated(playerTwo, screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(suspendTime);
                    await driver.waitForElement(playerTwo.name); // wait for player
                }
        
                await shared[`testSomePageNavigated${transition}`](screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(suspendTime);
                    await driver.waitForElement(somePage); // wait for some page
                }
        
                if (driver.isAndroid) {
                    await driver.navBack(); // some page back navigation
                } else {
                    await screen.goBackFromSomePage();
                }

                if (appSuspendResume) {
                    await driver.backgroundApp(suspendTime);
                    await driver.waitForElement(teamOne.name); // wait for teams list
                }

                await screen.loadedPlayerDetails(playerTwo);  // assert no changes after back navigation
                await screen.loadedTeamsList(); // assert no changes after back navigation
        
                await shared.testTeamNavigated(teamTwo, screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(suspendTime);
                    await driver.waitForElement(teamTwo.name); // wait for team
                }

                await shared[`testSomePageNavigated${transition}`](screen);

                if (appSuspendResume) {
                    await driver.backgroundApp(suspendTime);
                    await driver.waitForElement(somePage); // wait for some page
                }
        
                if (driver.isAndroid) {
                    await driver.navBack(); // some page back navigation
                } else {
                    await screen.goBackFromSomePage();
                }

                await screen.loadedPlayerDetails(playerTwo);  // assert no changes after back navigation
                await screen.loadedTeamDetails(teamTwo);
        
                await screen.goBackToPlayersList();
                await screen.loadedPlayersList();

                if (appSuspendResume) {
                    await driver.backgroundApp(suspendTime);
                    await driver.waitForElement(playerOne.name); // wait for players list
                }
        
                await screen.goBackToTeamsList();
                await screen.loadedTeamsList();
            });

            it("loaded home page again", async () => {
                await screen.goBackFromFrameHome();
                await screen.loadedHome();
            });
        });
    });

    describe("frame to nested frame with non-default transition", () => {
        const playerOne = playersData["playerOneSlide"];

        it("loaded home page", async () => {
            await screen.loadedHome();
        });

        it("loaded frame root with nested frame non-default transition", async () => {
            await screen.navigateToPageWithFrameNonDefaultTransition();
            await screen.loadedPageWithFrame();
        });

        it ("go back to home page again", async () => {
            if (appSuspendResume) {
                await driver.backgroundApp(suspendTime);
                await driver.waitForElement(playerOne.name); // wait for players list
            }

            await screen.goBackFromFrameHome();
            await screen.loadedHome();
        });
    });

    describe("nested frame to frame with non-default transition", () => {
        it("loaded home page", async () => {
            await screen.loadedHome();
        });

        it("loaded frame root with nested frame", async () => {
            await screen.navigateToPageWithFrame();
            await screen.loadedPageWithFrame();
        });
    
        it("navigate to some page with slide transition", async () => {
            shared.testSomePageNavigatedSlide(screen);

            if (appSuspendResume) {
                await driver.backgroundApp(suspendTime);
                await driver.waitForElement(somePage); // wait for some page
            }
        });

        it("navigate to still other page and go back twice", async () => {
            shared.testStillOtherPageNavigatedSlide(screen);

            if (appSuspendResume) {
                await driver.backgroundApp(suspendTime);
                await driver.waitForElement(stillOtherPage); // wait for still other page
            }

            if (driver.isAndroid) {
                await driver.navBack(); // some page back navigation
            } else {
                await screen.goBackFromStillOtherPage();
            }

            await screen.loadedSomePage();

            if (appSuspendResume) {
                await driver.backgroundApp(suspendTime);
                await driver.waitForElement(somePage); // wait for some page
            }

            shared.testStillOtherPageNavigatedSlide(screen);

            if (appSuspendResume) {
                await driver.backgroundApp(suspendTime);
                await driver.waitForElement(stillOtherPage); // wait for still other page
            }

            if (driver.isAndroid) {
                await driver.navBack(); // some page back navigation
            } else {
                await screen.goBackFromStillOtherPage();
            }

            await screen.loadedSomePage();
        });

        it("go back to home page again", async () => {
            await screen.goBackFromSomePage();

            await screen.goBackFromFrameHome();

            await screen.loadedHome();
        });
    });
});
