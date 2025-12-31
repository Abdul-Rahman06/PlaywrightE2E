Feature: Login

    Scenario: Login with Standard user
        Given I login with standard user
        Then Inventory page should be loaded

     Scenario: Login with locked out user
        Given I login with locked out user
        Then error should be shown

     Scenario: Login with invalid credentials 
        Given I login with invalid credentials 
        Then error should be shown for invalid credentials

     Scenario: Login with missing username 
        Given I try to login with missing username 
        Then error should be shown for missing username

      Scenario: Login with missing password
        Given I try to login with missing password
        Then error should be shown for missing password

      Scenario: The user should be logged out
        Given I logged in with standard user
        When I log out
        Then user should be logged out
        And the login page is shown