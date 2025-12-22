import styled from "styled-components";

const AboutContainer = styled.div`
  max-width: 700px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  min-width: 100px;
`;

const Value = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

export const About = () => {
  return (
    <AboutContainer>
      <Title>About Recipe Tracker</Title>

      <Section>
        <SectionTitle>App Information</SectionTitle>
        <InfoRow>
          <Label>Version:</Label>
          <Value>1.0.0</Value>
        </InfoRow>
        <InfoRow>
          <Label>Created by:</Label>
          <Value>Abbie Quirk</Value>
        </InfoRow>
      </Section>

      <Section>
        <SectionTitle>About</SectionTitle>
        <Description>
          Recipe Tracker is a comprehensive recipe management application that helps you
          organize your recipes, track ingredients, and create shopping lists. Built with
          modern technologies including Electron, React, and TypeScript.
        </Description>
      </Section>

      <Section>
        <SectionTitle>Features</SectionTitle>
        <Description>
          • Organize and manage your recipe collection
          <br />
          • Track ingredients and quantities
          <br />
          • Generate shopping lists
          <br />
          • User authentication and data privacy
        </Description>
      </Section>
    </AboutContainer>
  );
};
