import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import SearchPage from '../components/search-page/SearchPage';

// Mock the hook so tests don't make real API calls
vi.mock('../hooks/useFusionSearch', () => ({
    useFusionSearch: vi.fn(),
}));

import { useFusionSearch } from '../hooks/useFusionSearch';

const mockUseFusionSearch = vi.mocked(useFusionSearch);

describe('SearchPage', () => {
    it('renders the search input', () => {
        mockUseFusionSearch.mockReturnValue({ results: [], loading: false });

        render(<SearchPage />);

        expect(screen.getByPlaceholderText('Enter a monster name...')).toBeInTheDocument();
    });

    it('shows no results message when search returns empty', async () => {
        mockUseFusionSearch.mockReturnValue({ results: [], loading: false });

        render(<SearchPage />);

        await userEvent.type(screen.getByPlaceholderText('Enter a monster name...'), 'xyz');

        expect(screen.getByText('No fusion recipes found.')).toBeInTheDocument();
    });

    it('shows loading state while fetching', async () => {
        mockUseFusionSearch.mockReturnValue({ results: [], loading: true });

        render(<SearchPage />);

        await userEvent.type(screen.getByPlaceholderText('Enter a monster name...'), 'blue');

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders fusion recipe rows when results are returned', async () => {
        mockUseFusionSearch.mockReturnValue({
            loading: false,
            results: [
                {
                    materials: [
                        { name: 'Flame Swordsman', attribute: 'FIRE', monsterLevel: 5, monsterNumber: 1, type: ['Warrior'], description: null, attackPoints: 1800, defensePoints: 1600, imageUrl: null, monsterCardDrops: [], monsterVictoryBonuses: [] },
                        { name: 'Skull Stalker', attribute: 'DARK', monsterLevel: 3, monsterNumber: 2, type: ['Warrior'], description: null, attackPoints: 900, defensePoints: 600, imageUrl: null, monsterCardDrops: [], monsterVictoryBonuses: [] },
                    ],
                    fusionResult: {
                        name: 'Gaia the Fierce Knight', attribute: 'EARTH', monsterLevel: 7, monsterNumber: 3, type: ['Warrior'], description: null, attackPoints: 2300, defensePoints: 2100, imageUrl: null, monsterCardDrops: [], monsterVictoryBonuses: [],
                    },
                },
            ],
        });

        render(<SearchPage />);

        await userEvent.type(screen.getByPlaceholderText('Enter a monster name...'), 'flame');

        await waitFor(() => {
            expect(screen.getByText('Flame Swordsman')).toBeInTheDocument();
            expect(screen.getByText('Skull Stalker')).toBeInTheDocument();
            expect(screen.getByText('Gaia the Fierce Knight')).toBeInTheDocument();
        });
    });
});