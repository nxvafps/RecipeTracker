import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const HomeContainer = styled.div`
  max-width: 900px;
`;

const Hero = styled.div`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.text}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2.5rem;
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.active};
    transform: translateY(-2px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const QuickStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 3rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.activeGradient};
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.divider};
`;

const StatItem = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

export const Home = () => {
  const navigate = useNavigate();

  return (
    <HomeContainer>
      <Hero>
        <Title>Recipe Planner</Title>
        <Subtitle>
          Your personal kitchen companion for organizing recipes, tracking
          ingredients, and creating smart shopping lists. Cook smarter, not
          harder.
        </Subtitle>
      </Hero>

      <FeatureGrid>
        <FeatureCard onClick={() => navigate("/recipes")}>
          <FeatureIcon>📚</FeatureIcon>
          <FeatureTitle>Recipe Library</FeatureTitle>
          <FeatureDescription>
            Store and organize all your favorite recipes in one place. Add
            notes, ratings, and cooking times.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard onClick={() => navigate("/ingredients")}>
          <FeatureIcon>🥗</FeatureIcon>
          <FeatureTitle>Ingredient Management</FeatureTitle>
          <FeatureDescription>
            Keep track of ingredients, their quantities, and categories. Never
            forget what's in your pantry.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard onClick={() => navigate("/shopping")}>
          <FeatureIcon>🛒</FeatureIcon>
          <FeatureTitle>Shopping Lists</FeatureTitle>
          <FeatureDescription>
            Generate smart shopping lists from your recipes. Check off items as
            you shop.
          </FeatureDescription>
        </FeatureCard>
      </FeatureGrid>

      <QuickStats>
        <StatItem>
          <StatValue>∞</StatValue>
          <StatLabel>Unlimited Recipes</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>✓</StatValue>
          <StatLabel>Offline Support</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>🔒</StatValue>
          <StatLabel>Local Storage</StatLabel>
        </StatItem>
      </QuickStats>
    </HomeContainer>
  );
};
