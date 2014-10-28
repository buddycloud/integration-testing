Feature: Channel server exposes itself as expected

Scenario: Channel server adds expected disco#info

    Given I connect as the Enterprise's Riker
    And I run disco#items against the server
    When I see the channel server
    Then I expect it to see the correct disco#info