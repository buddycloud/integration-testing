Feature: Registration

Scenario: Creates expected nodes

    Given I connect as the Enterprise's Riker
    And I register with the server
    Then I expect it to see personal nodes set up